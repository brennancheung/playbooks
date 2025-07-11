import type { UIMessage } from '@ai-sdk/react'
import { TextPart } from './TextPart'
import { ToolPart } from './ToolPart'
import { StepStartPart } from './StepStartPart'

interface MessagePartProps {
  part: UIMessage['parts'][number]
}

export function MessagePart({ part }: MessagePartProps) {
  // Handle step-start parts
  if (part.type === 'step-start') {
    return <StepStartPart part={part} />
  }

  // Handle text parts
  if (part.type === 'text' && 'text' in part) {
    return <TextPart part={part} />
  }

  // Handle tool parts
  if (part.type.startsWith('tool-') && 'toolCallId' in part) {
    return <ToolPart part={part} />
  }

  // Fallback for unknown parts
  return (
    <div className="my-2 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
      <div className="text-xs text-muted-foreground">Unknown part type: {part.type}</div>
      <pre className="mt-1 text-xs overflow-x-auto whitespace-pre max-w-full">
        <code>{JSON.stringify(part, null, 2)}</code>
      </pre>
    </div>
  )
}

interface MessageProps {
  message: UIMessage
}

export function UserMessage({ message }: MessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-lg bg-primary px-4 py-2 text-primary-foreground overflow-hidden">
        <div className="space-y-1">
          {message.parts.map((part, index) => (
            <MessagePart key={index} part={part} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function AssistantMessage({ message }: MessageProps) {
  const textParts = message.parts.filter(
    (part) => part.type === 'text' || part.type === 'step-start'
  )

  if (textParts.length === 0) return null

  return (
    <div className="flex justify-start">
      <div className="rounded-lg bg-muted px-4 py-2 overflow-hidden">
        <div className="space-y-1">
          {textParts.map((part, index) => (
            <MessagePart key={index} part={part} />
          ))}
        </div>
      </div>
    </div>
  )
}