import os
import uuid
import aiofiles
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import File, Room
from app.config.settings import settings
from app.utils.helpers import get_file_type


class FileService:
    async def save_file(self, db: AsyncSession, room: Room, user_id: int, upload: UploadFile) -> File:
        max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        contents = await upload.read()
        if len(contents) > max_bytes:
            raise ValueError(f"File too large. Max: {settings.MAX_FILE_SIZE_MB}MB")

        ext = os.path.splitext(upload.filename)[1].lower()
        unique_name = f"{uuid.uuid4().hex}{ext}"

        room_dir = os.path.join(settings.FILE_UPLOAD_PATH, str(room.id))
        os.makedirs(room_dir, exist_ok=True)
        file_path = os.path.join(room_dir, unique_name)

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(contents)

        file_type = get_file_type(upload.content_type)
        f = File(
            room_id=room.id, user_id=user_id,
            file_name=unique_name, original_name=upload.filename,
            file_path=file_path, file_size=len(contents),
            mime_type=upload.content_type, file_extension=ext,
            file_type=file_type,
        )
        db.add(f)
        await db.commit()
        await db.refresh(f)
        return f

    async def get_room_files(self, db: AsyncSession, room_id: int):
        result = await db.execute(
            select(File).where(File.room_id == room_id, File.is_deleted == False).order_by(File.uploaded_at.desc())
        )
        return result.scalars().all()

    async def delete_file(self, db: AsyncSession, file: File):
        try:
            if os.path.exists(file.file_path):
                os.remove(file.file_path)
        except OSError:
            pass
        file.is_deleted = True
        await db.commit()


file_service = FileService()
