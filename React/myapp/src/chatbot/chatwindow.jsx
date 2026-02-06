import { useState } from 'react'
import ChatHeader from './chatheader'
import ChatBody from './chatbody'
import ChatIntro from './chatintro'

export default function ChatWindow() {
  const [ started, setStarted ] = useState(false);
  const [ messages, setMessages ] = useState([
    { 
      id: 1,
      sender: "bot", 
      text: "Hi, I'm your personal AI buddy. How can I help you?", 
      time: getTime(),
    },
  ])

  function getTime() {
    const date = new Date();
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' });
  }
  
  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: getTime(),
    }
    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: "bot",
          text: "Got it. Let me give you information.",
          time: getTime(),
        },
      ])
    }, 1000)
  }
  
  return (
    <div className="fixed bottom-20 right-10 w-80 h-[500px] rounded-xl shadow-2xl bg-gray-900 text-white overflow-hidden">
      {!started ? (<ChatIntro onStart={() => setStarted(true)} />) : (
        <div className="flex flex-col h-full">
          <ChatHeader />
          <ChatBody messages={messages} onSend={sendMessage} />
        </div>
      )}
    </div>
  )
}









