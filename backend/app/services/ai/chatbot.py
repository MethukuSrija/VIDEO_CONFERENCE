from typing import List, Dict, Optional
from openai import AsyncOpenAI
from app.config.settings import settings
from app.services.ai.prompt_templates import CHATBOT_SYSTEM_PROMPT, CODE_GENERATION_PROMPT


class AIChatbot:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.model = settings.OPENAI_MODEL

    async def chat(self, user_message: str, conversation_history: List[Dict] = None,
                   meeting_context: Optional[str] = None) -> Dict:
        if not self.client:
            return {"response": "⚠️ OpenAI not configured. Set OPENAI_API_KEY in .env", "model": "none", "tokens_used": 0}

        system = CHATBOT_SYSTEM_PROMPT.format(context=meeting_context or "None")
        messages = [{"role": "system", "content": system}]
        if conversation_history:
            messages.extend(conversation_history[-10:])
        messages.append({"role": "user", "content": user_message})

        try:
            r = await self.client.chat.completions.create(
                model=self.model, messages=messages, max_tokens=800, temperature=0.7,
            )
            return {
                "response": r.choices[0].message.content,
                "model": self.model,
                "tokens_used": r.usage.total_tokens if r.usage else 0,
            }
        except Exception as e:
            return {"response": f"⚠️ AI error: {e}", "model": self.model, "tokens_used": 0}

    async def generate_code(self, description: str, language: str = "python") -> str:
        if not self.client:
            return "⚠️ OpenAI not configured."
        prompt = CODE_GENERATION_PROMPT.format(language=language, requirement=description)
        try:
            r = await self.client.chat.completions.create(
                model=self.model, messages=[{"role": "user", "content": prompt}],
                max_tokens=1500, temperature=0.3,
            )
            return r.choices[0].message.content
        except Exception as e:
            return f"⚠️ Error: {e}"


ai_chatbot = AIChatbot()
