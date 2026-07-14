import secrets
import string
from datetime import datetime
from typing import Optional


def generate_random_code(length: int = 8) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_room_id() -> str:
    return secrets.token_urlsafe(12)


def calculate_duration_seconds(start: datetime, end: Optional[datetime] = None) -> int:
    if not start:
        return 0
    end = end or datetime.utcnow()
    return int((end - start).total_seconds())


def format_file_size(size_bytes: int) -> str:
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"


def get_file_type(mime_type: str) -> str:
    if not mime_type:
        return "other"
    if mime_type.startswith("image/"):
        return "image"
    if mime_type.startswith("video/"):
        return "video"
    if mime_type.startswith("audio/"):
        return "audio"
    if mime_type in ["application/pdf", "application/msword",
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        return "document"
    return "other"
