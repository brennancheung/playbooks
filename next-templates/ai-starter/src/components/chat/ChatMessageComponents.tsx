import { Wrench, FileText, Hash, FileEdit, FolderOpen } from 'lucide-react'
import type { UIMessage } from '@ai-sdk/react'

interface MessagePartProps {
  part: UIMessage['parts'][number]
}

interface FileOutput {
  content: Array<{ type: string; text: string }>
  isError?: boolean
}

export function MessagePart({ part }: MessagePartProps) {
  // Handle step-start parts
  if (part.type === 'step-start') {
    return (
      <div className="my-1 flex items-center gap-2 text-xs text-muted-foreground">
        <Hash className="h-3 w-3" />
        <span>New step</span>
      </div>
    )
  }
  
  // Handle text parts with state
  if (part.type === 'text' && 'text' in part) {
    const isDone = 'state' in part && part.state === 'done'
    return (
      <span className={`whitespace-pre-wrap ${!isDone ? 'text-muted-foreground' : ''}`}>
        {part.text}
      </span>
    )
  }
  
  // Handle tool parts (tool-read_file, tool-write_file, etc.)
  if (part.type.startsWith('tool-') && 'toolCallId' in part) {
    const toolName = part.type.replace('tool-', '')
    const hasOutput = 'output' in part && part.state === 'output-available'
    const hasError = 'errorText' in part && part.state === 'output-error'
    
    // Choose icon based on tool type
    const getToolIcon = () => {
      if (toolName.includes('read')) return <FileText className="h-4 w-4" />
      if (toolName.includes('write')) return <FileEdit className="h-4 w-4" />
      if (toolName.includes('list')) return <FolderOpen className="h-4 w-4" />
      return <Wrench className="h-4 w-4" />
    }
    
    return (
      <div className="my-2 rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
          {getToolIcon()}
          <span>Tool: {toolName}</span>
          <span className="text-xs opacity-60">({part.toolCallId})</span>
        </div>
        
        {'input' in part && (
          <div className="mt-2">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Input:</div>
            <pre className="mt-1 overflow-auto text-xs">
              <code>{JSON.stringify(part.input, null, 2)}</code>
            </pre>
          </div>
        )}
        
        {hasOutput && (
          <div className="mt-2">
            <div className="text-xs font-medium text-green-700 dark:text-green-300">Output:</div>
            {(() => {
              if (toolName === 'read_file' && 'output' in part && part.output) {
                const output = part.output as FileOutput
                if (output.content?.[0]?.text) {
                  return (
                    <div className="mt-1 rounded bg-gray-100 p-2 dark:bg-gray-800">
                      <pre className="overflow-auto text-xs max-h-60">
                        <code>{output.content[0].text}</code>
                      </pre>
                    </div>
                  )
                }
              }
              return (
                <pre className="mt-1 overflow-auto text-xs max-h-40">
                  <code>{JSON.stringify(part.output, null, 2)}</code>
                </pre>
              )
            })()}
          </div>
        )}
        
        {hasError && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            Error: {part.errorText}
          </div>
        )}
      </div>
    )
  }
  
  // Fallback for unknown parts
  return (
    <div className="my-2 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="text-xs text-muted-foreground">
        Unknown part type: {part.type}
      </div>
      <pre className="mt-1 overflow-auto text-xs">
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
      <div className="max-w-[80%] rounded-lg bg-primary px-4 py-2 text-primary-foreground">
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
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
        <div className="space-y-1">
          {message.parts.map((part, index) => (
            <MessagePart key={index} part={part} />
          ))}
        </div>
      </div>
    </div>
  )
}