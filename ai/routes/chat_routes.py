from fastapi import APIRouter, HTTPException
from models.chat_models import ChatRequest
from services.chat_service import process_chat

router = APIRouter()


@router.post("/chat")
async def chat_endpoint(data: ChatRequest):
    try:
        # Process user message
        result = await process_chat(data.message)

        # If backend already returns structured response
        if isinstance(result, dict):
            return result

        # If backend returns plain text
        if isinstance(result, str):
            return {
                "type": "text",
                "message": result
            }

        # Safety fallback
        return {
            "type": "text",
            "message": "Unexpected response format."
        }

    except Exception as e:
        print("Chat API error:", e)

        return {
            "type": "text",
            "message": "⚠ Server error. Please try again."
        }