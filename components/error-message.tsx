"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Card className="p-4 max-w-md mx-4 bg-red-900/20 border-red-800">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-red-200">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent border-red-700 text-red-300 hover:bg-red-900/30"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
