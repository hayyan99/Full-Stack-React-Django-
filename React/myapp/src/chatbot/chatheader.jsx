import { Bot } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="flex items-center gap-2 w-full h-12 rounded-t-xl p-2 text-white bg-gray-900 border-b">
      <div className="relative">
        <div className="h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center">
          <Bot width="18" height="18" />
        </div>
        <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="leading-tight">
        <h2 className="text-sm font-semibold">AI Assistant</h2>
        <p className="text-[0.6rem] text-zinc-200">Online • Replies instantly</p>
      </div>
    </div>
  )
}
