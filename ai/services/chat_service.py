from services.rag_service import generate_answer

async def process_chat(message: str):

    answer = generate_answer(message)

    return {
        "type": "text",
        "data": answer
    }