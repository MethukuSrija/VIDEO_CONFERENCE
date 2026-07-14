import json
import redis.asyncio as redis
from typing import List, Optional
from app.config.settings import settings


class WhiteboardService:
    def __init__(self):
        self.redis: Optional[redis.Redis] = None

    async def init_redis(self):
        if not self.redis:
            self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)

    async def save_stroke(self, room_id: str, stroke: dict):
        await self.init_redis()
        key = f"whiteboard:{room_id}"
        await self.redis.rpush(key, json.dumps(stroke))
        await self.redis.expire(key, 86400)

    async def get_state(self, room_id: str) -> List[dict]:
        await self.init_redis()
        key = f"whiteboard:{room_id}"
        strokes = await self.redis.lrange(key, 0, -1)
        return [json.loads(s) for s in strokes]

    async def clear(self, room_id: str):
        await self.init_redis()
        await self.redis.delete(f"whiteboard:{room_id}")

    async def undo(self, room_id: str):
        await self.init_redis()
        await self.redis.rpop(f"whiteboard:{room_id}")


whiteboard_service = WhiteboardService()
