import re
import json
from openai import AsyncOpenAI
from app.config.settings import settings
from app.services.ai.prompt_templates import SUMMARY_SYSTEM_PROMPT


class AISummarizer:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.model = settings.OPENAI_MODEL

    async def generate(self, transcript: str) -> dict:
        if not self.client:
            return {"summary": "⚠️ OpenAI not configured.", "key_points": [], "action_items": [], "decisions": []}
        if not transcript or len(transcript.strip()) < 50:
            return {"summary": "Transcript too short.", "key_points": [], "action_items": [], "decisions": []}

        try:
            r = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SUMMARY_SYSTEM_PROMPT},
                    {"role": "user", "content": f"Meeting transcript:\n\n{transcript}"},
                ],
                max_tokens=2000, temperature=0.3,
            )
            return self._parse(r.choices[0].message.content)
        except Exception as e:
            return {"summary": f"⚠️ Error: {e}", "key_points": [], "action_items": [], "decisions": []}

    def _parse(self, content: str) -> dict:
        result = {"summary": "", "key_points": [], "action_items": [], "decisions": []}
        current = "summary"
        for line in content.split("\n"):
            line = line.strip()
            if not line:
                continue
            if line.startswith("#"):
                low = line.lower()
                if "summary" in low: current = "summary"; continue
                if "key" in low or "discussion" in low: current = "key_points"; continue
                if "action" in low: current = "action_items"; continue
                if "decision" in low: current = "decisions"; continue
                if "next" in low: current = "_skip"; continue
            if line.startswith(("-", "*")):
                item = re.sub(r"^[-*]\s*", "", line).strip()
                if current in ["key_points", "action_items", "decisions"]:
                    result[current].append(item)
            elif current == "summary":
                result["summary"] += line + " "
        result["summary"] = result["summary"].strip()
        return result


ai_summarizer = AISummarizer()
