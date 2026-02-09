from langchain_google_genai import ChatGoogleGenerativeAI
from django.conf import settings

def get_chatbot_response(user_message, chat_history, user_context=""):
    try:
        # Build chat history
        history_text = "\n".join([f"User: {msg['user']}\nAssistant: {msg['bot']}" for msg in chat_history])
        
        # Create prompt
        prompt = f"""You are a FinBot, a helpful financial assistant for a money tracking app.

        {user_context}

        Chat History:
        {history_text}

        User Question: {user_message}

        Instructions:
        - For simple greetings (hi, hello, hey), respond warmly and briefly without mentioning financial data
        - For financial questions, provide helpful advice about budgeting, saving, and managing money
        - If user asks about their transactions or finances, use the financial data provided above
        - Keep responses concise and friendly

        Answer:"""
                
        # Call LLM
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7
        )
        
        result = llm.invoke(prompt)
        return result.content
        
    except Exception as e:
        print(f"Chatbot error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Chatbot error: {str(e)}")
