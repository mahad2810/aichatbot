export interface GeminiMessage {
  parts: Array<{ text: string }>
  role: "user" | "model"
}

export interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
  }
  safetySettings?: Array<{
    category: string
    threshold: string
  }>
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
      role: string
    }
    finishReason: string
    index: number
    safetyRatings: Array<{
      category: string
      probability: string
    }>
  }>
  promptFeedback?: {
    safetyRatings: Array<{
      category: string
      probability: string
    }>
  }
}

export const GEMINI_SAFETY_CATEGORIES = {
  HARASSMENT: "HARM_CATEGORY_HARASSMENT",
  HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
  SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
} as const

export const GEMINI_SAFETY_THRESHOLDS = {
  BLOCK_NONE: "BLOCK_NONE",
  BLOCK_ONLY_HIGH: "BLOCK_ONLY_HIGH",
  BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_LOW_AND_ABOVE: "BLOCK_LOW_AND_ABOVE",
} as const
