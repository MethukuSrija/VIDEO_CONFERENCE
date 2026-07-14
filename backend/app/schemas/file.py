from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FileUploadResponse(BaseModel):
    id: int
    url: str
    file_name: str
    file_size: int


class FileResponse(BaseModel):
    id: int
    file_name: str
    original_name: str
    file_url: Optional[str]
    file_size: int
    mime_type: Optional[str]
    file_type: str
    uploaded_by: int
    uploader_name: str
    uploaded_at: datetime
    download_count: int

    class Config:
        from_attributes = True
