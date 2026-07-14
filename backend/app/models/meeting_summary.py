from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class MeetingSummary(Base):
    __tablename__ = "meeting_summaries"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)
    recording_id = Column(Integer, ForeignKey("recordings.id", ondelete="SET NULL"), nullable=True)

    summary = Column(Text, nullable=False)
    key_points = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)
    decisions = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)

    summary_type = Column(String(50), default="post_meeting")
    generated_by = Column(String(50), default="gpt-4o-mini")
    language = Column(String(10), default="en")

    duration_seconds = Column(Integer, nullable=True)
    participant_count = Column(Integer, nullable=True)
    word_count = Column(Integer, nullable=True)

    is_final = Column(Boolean, default=True)
    is_shared = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    room = relationship("Room", back_populates="summaries")
    recording = relationship("Recording", back_populates="summaries")
