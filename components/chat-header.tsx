"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Sparkles } from "lucide-react"

interface ChatHeaderProps {
  onNewChat: () => void
  messageCount: number
}

export function ChatHeader({ onNewChat, messageCount }: ChatHeaderProps) {
  return (
    <header className="border-b border-gray-700 bg-gray-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-blue-400 mr-1" />
            <MessageSquare className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-100">Gemini Chat</h1>
          {messageCount > 0 && <span className="text-sm text-gray-400">({messageCount} messages)</span>}
        </div>

        <Button
          onClick={onNewChat}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
    </header>
  )
}
