import logging
from fastapi import WebSocket, WebSocketDisconnect, status

from app.utils.jwt import decode_token
from app.websocket.manager import manager
from app.services.whiteboard_service import whiteboard_service

logger = logging.getLogger("whiteboard-ws")


async def whiteboard_websocket(websocket: WebSocket, room_id: str, token: str):
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    payload = decode_token(token)
    if not payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_id = payload.get("user_id")
    user_name = payload.get("email", "Anonymous")
    await manager.connect(room_id, websocket, user_id, user_name)

    # Send existing state
    existing = await whiteboard_service.get_state(room_id)
    await websocket.send_json({"type": "init", "state": {"records": existing}})

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("type")

            if action == "stroke":
                stroke = data.get("data", {})
                await whiteboard_service.save_stroke(room_id, stroke)
                await manager.broadcast(room_id, {"type": "stroke", "data": stroke, "user_id": user_id}, exclude_ws=websocket)

            elif action == "clear":
                await whiteboard_service.clear(room_id)
                await manager.broadcast(room_id, {"type": "clear", "user_id": user_id})

            elif action == "undo":
                await whiteboard_service.undo(room_id)
                await manager.broadcast(room_id, {"type": "undo", "user_id": user_id})

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
