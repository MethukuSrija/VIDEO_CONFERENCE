from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import secrets

def generate_room_id():
    return secrets.token_urlsafe(12)

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String(50), unique=True, index=True, default=generate_room_id)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    password_hash = Column(String(255), nullable=True)
    is_private = Column(Boolean, default=False)
    waiting_room_enabled = Column(Boolean, default=True)
    allow_join_before_host = Column(Boolean, default=False)

    max_participants = Column(Integer, default=50)
    recording_enabled = Column(Boolean, default=True)
    chat_enabled = Column(Boolean, default=True)
    whiteboard_enabled = Column(Boolean, default=True)
    screen_share_enabled = Column(Boolean, default=True)

    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    is_active = Column(Boolean, default=True)
    is_live = Column(Boolean, default=False)

    creator_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    creator = relationship("User", back_populates="rooms_created", foreign_keys=[creator_id])
    participants = relationship("RoomParticipant", back_populates="room", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="room", cascade="all, delete-orphan")
    files = relationship("File", back_populates="room", cascade="all, delete-orphan")
    recordings = relationship("Recording", back_populates="room", cascade="all, delete-orphan")
    summaries = relationship("MeetingSummary", back_populates="room", cascade="all, delete-orphan")


class RoomParticipant(Base):
    __tablename__ = "room_participants"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    livekit_identity = Column(String(255), nullable=True)

    role = Column(String(20), default="participant")
    is_muted = Column(Boolean, default=False)
    is_video_off = Column(Boolean, default=False)
    is_hand_raised = Column(Boolean, default=False)

    is_online = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True), nullable=True)

    room = relationship("Room", back_populates="participants")
    user = relationship("User", back_populates="room_memberships")