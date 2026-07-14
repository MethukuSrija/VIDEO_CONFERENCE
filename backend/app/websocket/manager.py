from typing import Dict, List
from fastapi import WebSocket
import logging

logger = logging.getLogger("websocket")


class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, List[dict]] = {}

    async def connect(self, room_id: str, websocket: WebSocket, user_id: int, user_name: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append({"ws": websocket, "user_id": user_id, "user_name": user_name})

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms:
            self.rooms[room_id] = [c for c in self.rooms[room_id] if c["ws"] != websocket]
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast(self, room_id: str, message: dict, exclude_ws: WebSocket = None):
        if room_id not in self.rooms:
            return
        for conn in self.rooms[room_id]:
            if conn["ws"] == exclude_ws:
                continue
            try:
                await conn["ws"].send_json(message)
            except Exception:
                pass


manager = ConnectionManager()
