import time
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.models import Recording, Room
from app.services.livekit_service import livekit_service


class RecordingService:
    async def start_recording(self, db: AsyncSession, room: Room, layout: str = "grid") -> Recording:
        recording = Recording(
            room_id=room.id, livekit_room_name=room.room_id, status="pending",
        )
        db.add(recording)
        await db.commit()
        await db.refresh(recording)

        try:
            result = await livekit_service.start_room_recording(room.room_id, layout=layout)
            recording.egress_id = result["egress_id"]
            recording.status = "recording"
            await db.commit()
        except Exception as e:
            recording.status = "failed"
            recording.error_message = str(e)
            await db.commit()
        return recording

    async def stop_recording(self, db: AsyncSession, recording: Recording) -> Recording:
        try:
            info = await livekit_service.stop_recording(recording.egress_id)
            recording.status = "completed"
            recording.file_url = info.get("file_url")
            recording.duration_seconds = info.get("duration")
            recording.file_size = info.get("size")
            recording.completed_at = datetime.utcnow()
            await db.commit()
        except Exception as e:
            recording.status = "failed"
            recording.error_message = str(e)
            await db.commit()
        return recording

    async def list_room_recordings(self, db: AsyncSession, room_id: int):
        result = await db.execute(
            select(Recording).where(Recording.room_id == room_id).order_by(Recording.created_at.desc())
        )
        return result.scalars().all()


recording_service = RecordingService()
