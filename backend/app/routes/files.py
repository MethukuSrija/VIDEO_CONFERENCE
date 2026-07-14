import os
from fastapi import APIRouter, Depends, UploadFile, File as FastFile, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.config.database import get_db
from app.models import User, Room, File
from app.schemas.file import FileResponse, FileUploadResponse
from app.utils.deps import get_current_user
from app.services.file_service import file_service

router = APIRouter(prefix="/api/files", tags=["Files"])


@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = FastFile(...),
    room_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room_q = await db.execute(select(Room).where(Room.room_id == room_id))
    room = room_q.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    try:
        saved = await file_service.save_file(db, room, user.id, file)
        return FileUploadResponse(
            id=saved.id, url=f"/api/files/{saved.id}/download",
            file_name=saved.original_name, file_size=saved.file_size,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/room/{room_id}", response_model=List[FileResponse])
async def list_files(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    room_q = await db.execute(select(Room).where(Room.room_id == room_id))
    room = room_q.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    files = await file_service.get_room_files(db, room.id)
    out = []
    for f in files:
        u = await db.get(User, f.user_id)
        out.append(FileResponse(
            id=f.id, file_name=f.file_name, original_name=f.original_name,
            file_url=f"/api/files/{f.id}/download", file_size=f.file_size,
            mime_type=f.mime_type, file_type=f.file_type, uploaded_by=f.user_id,
            uploader_name=u.name if u else "Unknown", uploaded_at=f.uploaded_at,
            download_count=f.download_count,
        ))
    return out


@router.get("/{file_id}/download")
async def download(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    f = await db.get(File, file_id)
    if not f or f.is_deleted or not os.path.exists(f.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    f.download_count += 1
    await db.commit()
    return FileResponse(path=f.file_path, filename=f.original_name, media_type=f.mime_type or "application/octet-stream")


@router.delete("/{file_id}", status_code=204)
async def delete_file(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    f = await db.get(File, file_id)
    if not f:
        raise HTTPException(status_code=404, detail="File not found")
    if f.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    await file_service.delete_file(db, f)
    return None
