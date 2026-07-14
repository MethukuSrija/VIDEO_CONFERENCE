from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.config.database import get_db
from app.models import User, Room, Recording
from app.utils.deps import get_current_user
from app.services.recording_service import recording_service

router = APIRouter(prefix="/api/recordings", tags=["Recording"])


@router.post("/{room_id}/start")
async def start_recording(
    room_id: str,
    layout: str = "grid",
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Room).where(Room.room_id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.creator_id != user.id:
        raise HTTPException(status_code=403, detail="Only host can record")

    try:
        recording = await recording_service.start_recording(db, room, layout)
        return {"recording_id": recording.id, "egress_id": recording.egress_id, "status": "recording"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{egress_id}/stop")
async def stop_recording(
    egress_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Recording).where(Recording.egress_id == egress_id))
    recording = result.scalar_one_or_none()
    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")

    try:
        updated = await recording_service.stop_recording(db, recording)
        return {"status": "completed", "file_url": updated.file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/room/{room_id}")
async def list_recordings(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room_q = await db.execute(select(Room).where(Room.room_id == room_id))
    room = room_q.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    recordings = await recording_service.list_room_recordings(db, room.id)
    return [
        {
            "id": r.id, "status": r.status, "file_url": r.file_url,
            "duration": r.duration_seconds, "size": r.file_size,
            "summary": r.summary, "created_at": r.created_at.isoformat(),
        }
        for r in recordings
    ]
