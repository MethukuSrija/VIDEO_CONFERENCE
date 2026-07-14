from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ParticipantResponse(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    picture: Optional[str]
    role: str
    is_muted: bool
    is_video_off: bool
    is_hand_raised: bool
    is_screen_sharing: bool = False
    is_online: bool
    joined_at: datetime

    class Config:
        from_attributes = True


class ParticipantStats(BaseModel):
    total_participants: int
    online_count: int
    hosts: int
    moderators: int
    average_duration_minutes: float
