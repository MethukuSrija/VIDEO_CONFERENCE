from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.config.database import get_db
from app.models import User, Room, RoomParticipant
from app.schemas.participant import ParticipantResponse, ParticipantStats
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/participants", tags=["Participants"])


@router.get("/room/{room_id}", response_model=List[ParticipantResponse])
async def list_participants(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room_q = await db.execute(select(Room).where(Room.room_id == room_id))
    room = room_q.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    result = await db.execute(
        select(RoomParticipant, User)
        .join(User, User.id == RoomParticipant.user_id)
        .where(RoomParticipant.room_id == room.id)
        .order_by(RoomParticipant.joined_at)
    )
    return [
        ParticipantResponse(
            id=p.id, user_id=u.id, name=u.name, email=u.email, picture=u.picture,
            role=p.role, is_muted=p.is_muted, is_video_off=p.is_video_off,
            is_hand_raised=p.is_hand_raised, is_screen_sharing=False,
            is_online=p.is_online, joined_at=p.joined_at,
        )
        for p, u in result.all()
    ]


@router.post("/room/{room_id}/mute/{user_id}")
async def mute_participant(
    room_id: str, user_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room_q = await db.execute(select(Room).where(Room.room_id == room_id))
    room = room_q.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.creator_id != user.id:
        raise HTTPException(status_code=403, detail="Only host can mute")

    part_q = await db.execute(
        select(RoomParticipant)
        .where(RoomParticipant.room_id == room.id, RoomParticipant.user_id == user_id)
    )
    p = part_q.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    p.is_muted = True
    await db.commit()
    return {"status": "muted"}


@router.post("/room/{room_id}/remove/{user_id}", status_code=204)
async def remove_participant(
    room_id: str, user_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room_q = await db.execute(select(Room).where(Room.room_id == room_id))
    room = room_q.scalar_one_or_none()
    if not room or room.creator_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    part_q = await db.execute(
        select(RoomParticipant)
        .where(RoomParticipant.room_id == room.id, RoomParticipant.user_id == user_id)
    )
    p = part_q.scalar_one_or_none()
    if p:
        p.is_online = False
        from sqlalchemy.sql import func as sql_func
        p.left_at = sql_func.now()
        await db.commit()
    return None


@router.get("/room/{room_id}/stats", response_model=ParticipantStats)
async def get_stats(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room_q = await db.execute(select(Room).where(Room.room_id == room_id))
    room = room_q.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    total = await db.scalar(select(func.count(RoomParticipant.id)).where(RoomParticipant.room_id == room.id))
    online = await db.scalar(select(func.count(RoomParticipant.id)).where(RoomParticipant.room_id == room.id, RoomParticipant.is_online == True))
    hosts = await db.scalar(select(func.count(RoomParticipant.id)).where(RoomParticipant.room_id == room.id, RoomParticipant.role == "host"))

    return ParticipantStats(
        total_participants=total or 0,
        online_count=online or 0,
        hosts=hosts or 0,
        moderators=0,
        average_duration_minutes=0.0,
    )
