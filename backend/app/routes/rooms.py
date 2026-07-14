from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.config.database import get_db
from app.models import User, Room, RoomParticipant
from app.schemas.room import (
    RoomCreate, RoomResponse, JoinRoomRequest, LiveKitTokenResponse
)
from app.utils.deps import get_current_user
from app.utils.password import hash_password, verify_password
from app.services.livekit_service import livekit_service
from app.config.settings import settings

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])


@router.post("", response_model=RoomResponse, status_code=201)
async def create_room(
    req: RoomCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room = Room(
        title=req.title,
        description=req.description,
        password_hash=hash_password(req.password) if req.password else None,
        is_private=req.is_private,
        waiting_room_enabled=req.waiting_room_enabled,
        max_participants=req.max_participants,
        scheduled_at=req.scheduled_at,
        recording_enabled=req.recording_enabled,
        creator_id=user.id,
    )
    db.add(room)
    await db.commit()
    await db.refresh(room)

    participant = RoomParticipant(
        room_id=room.id, user_id=user.id, role="host",
    )
    db.add(participant)
    await db.commit()

    return _to_response(room)


@router.get("", response_model=List[RoomResponse])
async def list_rooms(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Room)
        .where(Room.creator_id == user.id)
        .order_by(Room.created_at.desc())
    )
    return [_to_response(r) for r in result.scalars().all()]


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Room).where(Room.room_id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return _to_response(room)


@router.post("/{room_id}/join", response_model=LiveKitTokenResponse)
async def join_room(
    room_id: str,
    req: JoinRoomRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Room).where(Room.room_id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.password_hash:
        if not req.password or not verify_password(req.password, room.password_hash):
            raise HTTPException(status_code=403, detail="Invalid room password")

    # Count online
    count_q = await db.execute(
        select(func.count(RoomParticipant.id))
        .where(RoomParticipant.room_id == room.id, RoomParticipant.is_online == True)
    )
    if (count_q.scalar() or 0) >= room.max_participants:
        raise HTTPException(status_code=403, detail="Room is full")

    is_host = room.creator_id == user.id
    part_q = await db.execute(
        select(RoomParticipant)
        .where(RoomParticipant.room_id == room.id, RoomParticipant.user_id == user.id)
    )
    participant = part_q.scalar_one_or_none()
    if not participant:
        participant = RoomParticipant(room_id=room.id, user_id=user.id)
        db.add(participant)
    participant.is_online = True
    participant.role = "host" if is_host else "participant"
    participant.livekit_identity = f"user_{user.id}"

    if not room.is_live:
        room.is_live = True
        from sqlalchemy.sql import func as sql_func
        room.started_at = sql_func.now()

    await db.commit()

    token = livekit_service.generate_token(
        room_name=room.room_id,
        identity=participant.livekit_identity,
        name=user.name,
        is_host=is_host,
    )
    return LiveKitTokenResponse(
        token=token,
        url=settings.LIVEKIT_URL,
        room_name=room.room_id,
        identity=participant.livekit_identity,
    )


@router.post("/{room_id}/leave", status_code=204)
async def leave_room(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Room).where(Room.room_id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        return None

    part_q = await db.execute(
        select(RoomParticipant)
        .where(RoomParticipant.room_id == room.id, RoomParticipant.user_id == user.id)
    )
    p = part_q.scalar_one_or_none()
    if p:
        p.is_online = False
        from sqlalchemy.sql import func as sql_func
        p.left_at = sql_func.now()
        await db.commit()
    return None


@router.post("/{room_id}/end", status_code=204)
async def end_room(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Room).where(Room.room_id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.creator_id != user.id:
        raise HTTPException(status_code=403, detail="Only host can end")

    room.is_live = False
    from sqlalchemy.sql import func as sql_func
    room.ended_at = sql_func.now()
    await db.commit()
    return None


def _to_response(r: Room) -> RoomResponse:
    return RoomResponse(
        id=r.id, room_id=r.room_id, title=r.title, description=r.description,
        is_private=r.is_private, has_password=bool(r.password_hash),
        waiting_room_enabled=r.waiting_room_enabled,
        max_participants=r.max_participants, is_live=r.is_live,
        creator_id=r.creator_id, scheduled_at=r.scheduled_at, created_at=r.created_at,
    )
