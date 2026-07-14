from fastapi import APIRouter, Depends, HTTPException
from app.config.database import get_db
from app.models import User
from app.utils.deps import get_current_user
from app.services.ai.chatbot import ai_chatbot
from app.schemas.ai import AIChatRequest, AIChatResponse, SummaryRequest
from app.config.settings import settings

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(
    req: AIChatRequest,
    user: User = Depends(get_current_user),
):
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="AI not configured")

    result = await ai_chatbot.chat(
        user_message=req.message,
        conversation_history=req.conversation_history,
        meeting_context=req.meeting_context,
    )
    return AIChatResponse(**result)


@router.post("/summarize")
async def summarize(
    req: SummaryRequest,
    user: User = Depends(get_current_user),
):
    from app.services.ai.summary import ai_summarizer
    if not req.transcript:
        return {"summary": "No transcript provided", "key_points": [], "action_items": [], "decisions": []}

    result = await ai_summarizer.generate(req.transcript)
    return result
