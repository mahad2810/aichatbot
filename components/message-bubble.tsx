import type { Message } from "@/types/chat"
import { Bot, User } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TextFormatter } from "./text-formatter"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"
  // Use displayContent for UI if available, otherwise use the full content
  const displayContent = message.displayContent || message.content

  // Determine if PDF content was included in the original message
  // This is a simple check; a more robust solution might use a flag in the Message interface
  const hasPdfContent = isUser && message.content !== displayContent

  return (
    <div
      className={cn(
        "flex gap-3 max-w-4xl mx-auto px-4 py-6",
        isUser ? "bg-gray-800 justify-end" : "bg-gray-750 justify-start",
      )}
    >
      {/* Avatar - only show for AI messages on the left */}
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-green-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div className={cn("flex-1 space-y-2 max-w-3xl", isUser ? "text-right" : "text-left")}>
        <div className={cn("font-semibold text-sm", isUser ? "text-blue-300" : "text-green-300")}>
          {isUser ? "You" : "Gemini"}
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser ? "bg-blue-600 text-white ml-auto max-w-lg" : "bg-gray-700 text-gray-100 mr-auto",
          )}
        >
          {isUser ? (
            <>
              <p className="whitespace-pre-wrap leading-relaxed">{displayContent}</p>
              {hasPdfContent && (
                <p className="text-xs text-gray-200 mt-1 italic">
                  (1 PDF file uploaded)
                </p>
              )}
            </>
          ) : (
            <TextFormatter text={displayContent} />
          )}
        </div>

        <div className={cn("text-xs text-gray-400", isUser ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {/* Avatar - only show for user messages on the right */}
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
