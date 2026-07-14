from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)

    content = Column(Text, nullable=False)
    message_type = Column(String(20), default="text")
    file_url = Column(String(500), nullable=True)
    file_name = Column(String(255), nullable=True)

    is_ai_response = Column(Boolean, default=False)
    ai_context = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    room = relationship("Room", back_populates="messages")
    user = relationship("User", back_populates="messages")
