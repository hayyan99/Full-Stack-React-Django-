import { Send } from "lucide-react"
import { useState, useEffect, useRef } from "react";
export default function ChatBody({ messages, onSend, loading }) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])
  
  return (
    <>
      <div className="flex-1 px-5 py-4 space-y-2 overflow-y-auto scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[75%]">
              <p className={`text-xs text-zinc-400 mb-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                {msg.sender === "user" ? "You" : "AI"}
              </p>
              <div className={`px-4 py-2 rounded-2xl shadow text-white text-sm ${msg.sender === "user" ? "bg-blue-500 rounded-tr-sm ml-1" : "bg-white/10 backdrop-blur-md rounded-tl-sm"}`}>
                {msg.text}
              </div>
              <p className={`text-[10px] text-zinc-400 mt-1 ${msg.sender === "user" ? "text-right mr-1" : "ml-1"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[75%]">
              <p className="text-xs text-zinc-400 mb-1">AI</p>
              <div className="px-4 py-2 rounded-2xl shadow text-white text-sm bg-white/10 backdrop-blur-md rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{animationDelay: '0.2s'}}>●</span>
                  <span className="animate-bounce" style={{animationDelay: '0.4s'}}>●</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
          <input 
            type="text" 
            value={text}
            placeholder="Write a message..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-xs placeholder:text-zinc-300 outline-none"
          />
          <button onClick={send} className="bg-blue-500 px-1.5 py-1.5 rounded-full hover:bg-blue-600 transition cursor-pointer">
            <Send width="13" height="13"/>
          </button>
        </div>
      </div>
    </>
  );
  function send() {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  }
}
