"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface TextFormatterProps {
  text: string
  className?: string
}

export function TextFormatter({ text, className }: TextFormatterProps) {
  const formatText = (text: string) => {
    // Split text into lines for processing
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let currentIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Handle code blocks (```code```)
      if (line.trim().startsWith("```")) {
        const codeLines = []
        let j = i + 1

        // Find the closing ```
        while (j < lines.length && !lines[j].trim().startsWith("```")) {
          codeLines.push(lines[j])
          j++
        }

        if (j < lines.length) {
          elements.push(
            <div key={currentIndex++} className="my-3">
              <pre className="bg-gray-800 border border-gray-600 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-100 font-mono">{codeLines.join("\n")}</code>
              </pre>
            </div>,
          )
          i = j // Skip to after the closing ```
          continue
        }
      }

      // Handle headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={currentIndex++} className="text-2xl font-bold text-gray-100 mt-4 mb-2">
            {line.substring(2)}
          </h1>,
        )
        continue
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={currentIndex++} className="text-xl font-bold text-gray-100 mt-3 mb-2">
            {line.substring(3)}
          </h2>,
        )
        continue
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={currentIndex++} className="text-lg font-bold text-gray-100 mt-3 mb-1">
            {line.substring(4)}
          </h3>,
        )
        continue
      }

      // Handle bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const listItems = []
        let j = i

        while (j < lines.length && (lines[j].trim().startsWith("- ") || lines[j].trim().startsWith("* "))) {
          listItems.push(lines[j].trim().substring(2))
          j++
        }

        elements.push(
          <ul key={currentIndex++} className="list-disc list-inside my-2 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-100">
                {formatInlineText(item)}
              </li>
            ))}
          </ul>,
        )
        i = j - 1
        continue
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        const listItems = []
        let j = i

        while (j < lines.length && /^\d+\.\s/.test(lines[j].trim())) {
          listItems.push(lines[j].trim().replace(/^\d+\.\s/, ""))
          j++
        }

        elements.push(
          <ol key={currentIndex++} className="list-decimal list-inside my-2 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-100">
                {formatInlineText(item)}
              </li>
            ))}
          </ol>,
        )
        i = j - 1
        continue
      }

      // Handle empty lines
      if (line.trim() === "") {
        elements.push(<br key={currentIndex++} />)
        continue
      }

      // Handle regular paragraphs
      elements.push(
        <p key={currentIndex++} className="text-gray-100 leading-relaxed mb-2">
          {formatInlineText(line)}
        </p>,
      )
    }

    return elements
  }

  const formatInlineText = (text: string) => {
    // Handle inline code (`code`)
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-700 text-blue-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
    )

    // Handle bold text (**text** or __text__)
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    text = text.replace(/__([^_]+)__/g, '<strong class="font-bold text-white">$1</strong>')

    // Handle italic text (*text* or _text_)
    text = text.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-200">$1</em>')
    text = text.replace(/_([^_]+)_/g, '<em class="italic text-gray-200">$1</em>')

    // Handle links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, // Corrected regex for markdown links
      '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  return <div className={cn("prose prose-sm max-w-none", className)}>{formatText(text)}</div>
}
