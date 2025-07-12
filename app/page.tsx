"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "@/components/message-bubble"
import { TypingIndicator } from "@/components/typing-indicator"
import { ChatInput } from "@/components/chat-input"
import { ChatHeader } from "@/components/chat-header"
import { useChat } from "@/hooks/use-chat"
import { Card } from "@/components/ui/card"
import { MessageSquare, Sparkles } from "lucide-react"

export default function ChatPage() {
  const { messages, isLoading, sendMessage, clearChat } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <ChatHeader onNewChat={clearChat} messageCount={messages.length} />

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 max-w-md mx-4 text-center bg-gray-800 border-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-blue-400 mr-2" />
                  <MessageSquare className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-200 mb-2">Welcome to MaverickBot</h2>
                <p className="text-gray-400">
                  Start a conversation with MaverickBot — your personal AI assistant. Your chat history will be remembered for context-aware responses.
                </p>
                <div className="mt-4 text-xs text-gray-500">Powered by Google Gemini 2.0 Flash</div>
              </Card>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
    </div>
  )
}
