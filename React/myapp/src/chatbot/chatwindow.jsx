import { useState } from 'react'
import ChatHeader from './chatheader'
import ChatBody from './chatbody'
import ChatIntro from './chatintro'
import { sendChatMessage } from '../services/chatapi'

export default function ChatWindow() {
  const [ started, setStarted ] = useState(false);
  const [ messages, setMessages ] = useState([
    { 
      id: 1,
      sender: "bot", 
      text: "Hi, I'm your financial assistant. How can I help you today?", 
      time: getTime(),
    },
  ])
  const [ sessionId ] = useState(() => `session_${Date.now()}`);
  const [ loading, setLoading ] = useState(false);

  function getTime() {
    const date = new Date();
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' });
  }
  
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: getTime(),
    }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true);

    try {
      const response = await sendChatMessage(text, sessionId);
      setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: "bot",
          text: response.response,
          time: getTime(),
        },
      ])
    } catch {
      setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: "bot",
          text: "Sorry, I'm having trouble connecting. Please try again.",
          time: getTime(),
        },
      ])
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="fixed bottom-20 right-10 w-80 h-[500px] rounded-xl shadow-2xl bg-gray-900 text-white overflow-hidden">
      {!started ? (<ChatIntro onStart={() => setStarted(true)} />) : (
        <div className="flex flex-col h-full">
          <ChatHeader />
          <ChatBody messages={messages} onSend={sendMessage} loading={loading} />
        </div>
      )}
    </div>
  )
}









