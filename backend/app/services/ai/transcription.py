from openai import AsyncOpenAI
from app.config.settings import settings


class AITranscriber:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def transcribe_file(self, file_path: str) -> str:
        if not self.client:
            return ""
        try:
            with open(file_path, "rb") as f:
                r = await self.client.audio.transcriptions.create(
                    file=("audio.mp3", f), model=settings.OPENAI_WHISPER_MODEL,
                )
            return r.text
        except Exception as e:
            return f"Error: {e}"


ai_transcriber = AITranscriber()
