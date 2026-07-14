from app.services.ai.chatbot import ai_chatbot
from app.services.ai.summary import ai_summarizer

class OpenAIService:
    chat_with_context = staticmethod(ai_chatbot.chat)
    summarize_meeting = staticmethod(ai_summarizer.generate)

openai_service = OpenAIService()
