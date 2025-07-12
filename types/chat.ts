export interface Message {
  id: string
  content: string // Full content sent to API (includes parsed PDF if applicable)
  role: "user" | "assistant"
  timestamp: Date
  displayContent?: string // Optional: content to display in UI if different from 'content' (e.g., user's typed message without PDF)
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  input: string
}
