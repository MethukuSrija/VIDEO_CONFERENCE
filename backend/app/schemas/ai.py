from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    room_id: str
    conversation_history: Optional[List[Dict]] = []
    meeting_context: Optional[str] = None


class AIChatResponse(BaseModel):
    response: str
    model: str
    tokens_used: Optional[int] = None


class SummaryRequest(BaseModel):
    room_id: str
    transcript: Optional[str] = None
    recording_id: Optional[int] = None
    summary_type: str = "post_meeting"
