from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class RoomCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    password: Optional[str] = Field(None, min_length=4, max_length=50)
    is_private: bool = False
    waiting_room_enabled: bool = True
    max_participants: int = Field(50, ge=2, le=50)
    scheduled_at: Optional[datetime] = None
    recording_enabled: bool = True


class RoomUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_private: Optional[bool] = None
    waiting_room_enabled: Optional[bool] = None


class RoomResponse(BaseModel):
    id: int
    room_id: str
    title: str
    description: Optional[str]
    is_private: bool
    has_password: bool
    waiting_room_enabled: bool
    max_participants: int
    is_live: bool
    creator_id: int
    scheduled_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class JoinRoomRequest(BaseModel):
    password: Optional[str] = None


class LiveKitTokenResponse(BaseModel):
    token: str
    url: str
    room_name: str
    identity: str
