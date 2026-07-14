from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, BigInteger, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Recording(Base):
    __tablename__ = "recordings"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)

    egress_id = Column(String(255), unique=True, index=True, nullable=True)
    livekit_room_name = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=True)
    file_url = Column(String(500), nullable=True)
    s3_key = Column(String(500), nullable=True)
    file_size = Column(BigInteger, nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    status = Column(String(20), default="pending", index=True)
    error_message = Column(Text, nullable=True)

    summary = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    room = relationship("Room", back_populates="recordings")
    summaries = relationship("MeetingSummary", back_populates="recording")
