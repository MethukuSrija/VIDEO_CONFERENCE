from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.utils.deps import get_current_user
from app.models import User
from app.services.whiteboard_service import whiteboard_service

router = APIRouter(prefix="/api/whiteboard", tags=["Whiteboard"])


class StrokeData(BaseModel):
    type: str
    data: dict


@router.post("/{room_id}/save")
async def save_stroke(room_id: str, stroke: StrokeData, user: User = Depends(get_current_user)):
    await whiteboard_service.save_stroke(room_id, stroke.data)
    return {"status": "saved"}


@router.get("/{room_id}/state")
async def get_state(room_id: str, user: User = Depends(get_current_user)):
    strokes = await whiteboard_service.get_state(room_id)
    return {"strokes": strokes, "count": len(strokes)}


@router.post("/{room_id}/clear")
async def clear(room_id: str, user: User = Depends(get_current_user)):
    await whiteboard_service.clear(room_id)
    return {"status": "cleared"}


@router.post("/{room_id}/undo")
async def undo(room_id: str, user: User = Depends(get_current_user)):
    await whiteboard_service.undo(room_id)
    return {"status": "undone"}
