from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    message_type: str = "text"
    file_url: Optional[str] = None
    file_name: Optional[str] = None


class MessageResponse(BaseModel):
    id: int
    room_id: int
    user_id: Optional[int]
    user_name: str
    user_picture: Optional[str]
    content: str
    message_type: str
    file_url: Optional[str]
    file_name: Optional[str]
    is_ai_response: bool
    created_at: datetime

    class Config:
        from_attributes = True
