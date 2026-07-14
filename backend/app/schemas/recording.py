from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RecordingStartRequest(BaseModel):
    layout: str = "grid"
    audio_only: bool = False
    video_only: bool = False


class RecordingResponse(BaseModel):
    id: int
    room_id: int
    egress_id: Optional[str]
    status: str
    file_url: Optional[str]
    duration_seconds: Optional[int]
    file_size: Optional[int]
    summary: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True
