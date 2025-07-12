"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { parsePdf } from "@/components/pdf-parser"

interface ChatInputProps {
  onSendMessage: (userDisplayText: string, contentForApi: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedPdfContent, setParsedPdfContent] = useState<string | null>(null)
  const [isParsingPdf, setIsParsingPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      setIsParsingPdf(true)
      try {
        const text = await parsePdf(file)
        setParsedPdfContent(text)
        console.log("Parsed PDF Content (from pdf-parser):", text) // Log parsed content
      } catch (error) {
        console.error("Error parsing PDF:", error)
        setParsedPdfContent(null)
        setSelectedFile(null)
        alert("Failed to parse PDF. Please try again.")
      } finally {
        setIsParsingPdf(false)
      }
    } else {
      setSelectedFile(null)
      setParsedPdfContent(null)
      if (file) {
        alert("Please upload a PDF file.")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userTypedText = input.trim()
    let contentForApi = userTypedText

    if (parsedPdfContent) {
      // Append parsed PDF content with a clear separator for the API
      contentForApi += `\n\n--- Attached PDF Content ---\n${parsedPdfContent}\n--- End Attached PDF Content ---`
    }

    console.log("ChatInput - userDisplayText (for UI):", userTypedText)
    console.log("ChatInput - contentForApi (for API):", contentForApi)

    // Only send if there's typed text OR a parsed PDF
    if ((userTypedText || parsedPdfContent) && !disabled && !isParsingPdf) {
      onSendMessage(userTypedText, contentForApi) // Pass both display and API content
      setInput("")
      setSelectedFile(null)
      setParsedPdfContent(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Clear the file input element
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-gray-700 bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedFile ? "Add a message or send the PDF content..." : "Message Gemini..."}
            className="min-h-[60px] max-h-[200px] resize-none pr-12 py-3 pl-12 bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
            disabled={disabled || isParsingPdf}
          />
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload-input"
          />
          {/* Custom label for file input */}
          <label
            htmlFor="pdf-upload-input"
            className={cn(
              "absolute left-2 bottom-2 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer",
              disabled || isParsingPdf
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600",
            )}
            title="Upload PDF"
          >
            {isParsingPdf ? (
              <span className="animate-spin text-sm">...</span> // Simple loading indicator
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </label>
          <Button
            type="submit"
            size="icon"
            disabled={(!input.trim() && !selectedFile) || disabled || isParsingPdf}
            className={cn(
              "absolute right-2 bottom-2 h-8 w-8",
              (input.trim() || selectedFile) && !disabled && !isParsingPdf
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-gray-600 text-gray-400 cursor-not-allowed",
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-400 flex items-center justify-between">
            <span>{isParsingPdf ? "Parsing PDF..." : `1 file uploaded: ${selectedFile.name}`}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null)
                setParsedPdfContent(null)
                setIsParsingPdf(false)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
              }}
              className="text-red-400 hover:bg-gray-700 hover:text-red-300"
            >
              Remove
            </Button>
          </div>
        )}
        <div className="text-xs text-gray-400 mt-2 text-center">Press Enter to send, Shift + Enter for new line</div>
      </form>
    </div>
  )
}
