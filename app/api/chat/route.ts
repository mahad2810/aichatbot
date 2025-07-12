import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    console.log("API Route - Received messages from client:", messages)

    // The 'messages' array received from the client (via useChat hook)
    // is already in the correct format for Gemini's 'contents' field:
    // [{ parts: [{ text: "..." }], role: "user" | "model" }]
    // So, we can directly use it.

    console.log("API Route - Sending to Gemini:", JSON.stringify({ contents: messages }, null, 2))

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: messages, // Directly use the messages array from the client
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API Error:", errorData)
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()

    // Extract the response text from Gemini's response format
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response at the moment."

    return NextResponse.json({
      message: aiResponse,
      success: true,
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to get AI response",
        message: "I'm experiencing some technical difficulties. Please try again later.",
        success: false,
      },
      { status: 500 },
    )
  }
}
