from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    file_name = Column(String(500), nullable=False)
    original_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_url = Column(String(1000), nullable=True)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(255), nullable=True)
    file_extension = Column(String(20), nullable=True)

    file_type = Column(String(50), default="other")
    is_public = Column(Boolean, default=True)

    is_deleted = Column(Boolean, default=False)
    download_count = Column(Integer, default=0)

    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

    room = relationship("Room", back_populates="files")
    user = relationship("User")
