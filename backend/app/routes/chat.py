from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
import json
from sqlalchemy import select

from app.config.database import AsyncSessionLocal
from app.models import User, Message, Room
from app.utils.jwt import decode_token
from app.websocket.manager import manager

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.websocket("/ws/{room_id}")
async def chat_ws(websocket: WebSocket, room_id: int, token: str = None):
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    payload = decode_token(token)
    if not payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_id = payload.get("user_id")
    if not user_id:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    async with AsyncSessionLocal() as db:
        u = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
        r = (await db.execute(select(Room).where(Room.id == room_id))).scalar_one_or_none()
        if not u or not r:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        await manager.connect(str(room_id), websocket, user_id, u.name)
        await manager.broadcast(str(room_id), {
            "type": "user_joined", "user_id": user_id, "user_name": u.name, "user_picture": u.picture,
        }, exclude_ws=websocket)

        try:
            while True:
                raw = await websocket.receive_text()
                data = json.loads(raw)
                t = data.get("type", "message")

                if t == "message":
                    m = Message(room_id=room_id, user_id=user_id, content=data.get("content", ""))
                    db.add(m)
                    await db.commit()
                    await db.refresh(m)
                    await manager.broadcast(str(room_id), {
                        "type": "message", "id": m.id, "user_id": user_id, "user_name": u.name,
                        "user_picture": u.picture, "content": m.content, "message_type": "text",
                        "is_ai_response": False, "created_at": m.created_at.isoformat(),
                    })

                elif t == "ai_request":
                    from app.services.ai.chatbot import ai_chatbot
                    user_msg = data.get("content", "")
                    history = data.get("history", [])

                    m = Message(room_id=room_id, user_id=user_id, content=user_msg)
                    db.add(m)
                    await db.commit()

                    await manager.broadcast(str(room_id), {
                        "type": "message", "user_id": user_id, "user_name": u.name,
                        "user_picture": u.picture, "content": user_msg, "message_type": "text",
                        "is_ai_response": False,
                    })

                    result = await ai_chatbot.chat(user_msg, history)
                    ai_text = result["response"]

                    m_ai = Message(room_id=room_id, user_id=None, content=ai_text,
                                   message_type="ai", is_ai_response=True)
                    db.add(m_ai)
                    await db.commit()

                    await manager.broadcast(str(room_id), {
                        "type": "message", "user_id": None, "user_name": "🤖 MeetAI",
                        "user_picture": None, "content": ai_text, "message_type": "ai",
                        "is_ai_response": True,
                    })

                elif t == "reaction":
                    await manager.broadcast(str(room_id), {
                        "type": "reaction", "user_id": user_id, "user_name": u.name,
                        "emoji": data.get("emoji"),
                    })

                elif t == "hand_raise":
                    await manager.broadcast(str(room_id), {
                        "type": "hand_raise", "user_id": user_id, "user_name": u.name,
                        "raised": data.get("raised", True),
                    })

        except WebSocketDisconnect:
            manager.disconnect(str(room_id), websocket)
            await manager.broadcast(str(room_id), {
                "type": "user_left", "user_id": user_id, "user_name": u.name,
            })


@router.get("/{room_id}/messages")
async def get_history(room_id: int, skip: int = 0, limit: int = 100, db=__import__('app.config.database', fromlist=['get_db']).get_db):
    from app.config.database import get_db
    pass  # simpler version
