import { Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-4xl mx-auto px-4 py-6 bg-gray-750 justify-start">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-green-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2 max-w-3xl text-left">
        <div className="font-semibold text-sm text-green-300">MaverickBot</div>
        <div className="bg-gray-700 rounded-2xl px-4 py-3 shadow-sm mr-auto max-w-xs">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-400 ml-2">MaverickBot is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
