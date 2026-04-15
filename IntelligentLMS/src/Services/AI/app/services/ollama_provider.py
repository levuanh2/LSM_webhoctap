import httpx
import asyncio
from app.config import settings
from app.utils.logger import logger

class OllamaProvider:
    @classmethod
    async def generate_response(cls, prompt: str, json_format: bool = False, max_retries: int = 3) -> str:
        gen_payload = {
            "model": settings.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        }
        if json_format:
            gen_payload["format"] = "json"

        chat_payload = {
            "model": settings.OLLAMA_MODEL,
            "stream": False,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        if json_format:
            chat_payload["format"] = "json"

        for attempt in range(1, max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    # Prefer /api/generate; fallback to /api/chat if endpoint not available (some builds)
                    resp = await client.post(f"{settings.OLLAMA_URL}/api/generate", json=gen_payload)
                    if resp.status_code == 404:
                        resp = await client.post(f"{settings.OLLAMA_URL}/api/chat", json=chat_payload)
                    resp.raise_for_status()
                    data = resp.json()
                    # generate: { response: "..." } ; chat: { message: { content: "..." } }
                    if isinstance(data, dict):
                        if "response" in data:
                            return str(data.get("response", "")).strip()
                        msg = data.get("message") or {}
                        if isinstance(msg, dict) and "content" in msg:
                            return str(msg.get("content", "")).strip()
                    return ""
            except httpx.TimeoutException as e:
                logger.warning(f"Ollama timeout on attempt {attempt}/{max_retries}")
                if attempt == max_retries:
                    raise Exception("Ollama service timeout.") from e
            except Exception as e:
                logger.error(f"Ollama API Error on attempt {attempt}: {str(e)}")
                if attempt == max_retries:
                    raise Exception(f"Ollama service error: {str(e)}") from e
            
            await asyncio.sleep(1) # backoff trước khi retry
