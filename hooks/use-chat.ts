"use client"

import { useState, useCallback } from "react"
import type { Message, ChatState } from "@/types/chat"

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    input: "",
  })

  const sendMessage = useCallback(
    async (userDisplayText: string, contentForApi: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: contentForApi, // This is the full content sent to the API
        role: "user",
        timestamp: new Date(),
        displayContent: userDisplayText, // This is what will be shown in the UI
      }

      // Add user message and set loading state
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
      }))

      try {
        // Prepare messages for the API, ensuring the 'content' field is used for the model
        const messagesForApi = [...chatState.messages, userMessage].map((msg) => ({
          parts: [{ text: msg.content }],
          role: msg.role === "assistant" ? "model" : "user",
        }))

        console.log("useChat - messagesForApi (before fetch):", messagesForApi)

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messagesForApi,
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to get response")
        }

        // Create AI response message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          role: "assistant",
          timestamp: new Date(),
        }

        // Add AI response and stop loading
        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          isLoading: false,
        }))
      } catch (error) {
        console.error("Error sending message:", error)

        // Add error message to the chat
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I encountered an error while processing your request. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        }

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          isLoading: false,
        }))
      }
    },
    [chatState.messages], // Dependency on chatState.messages for history
  )

  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      input: "",
    })
  }, [])

  return {
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    sendMessage,
    clearChat,
  }
}
