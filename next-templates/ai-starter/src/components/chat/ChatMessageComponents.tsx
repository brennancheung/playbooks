import { Wrench, FileText, Hash, FileEdit, FolderOpen } from 'lucide-react'
import type { UIMessage } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
      <div className={`prose prose-sm dark:prose-invert max-w-none ${!isDone ? 'opacity-70' : ''}`}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom renderers for specific elements
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              const isInline = !match
              
              if (isInline) {
                return (
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800" {...props}>
                    {children}
                  </code>
                )
              }
              
              return (
                <div className="my-2">
                  <pre className="overflow-auto rounded bg-gray-100 p-3 dark:bg-gray-800">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              )
            },
            pre({ children }) {
              return <>{children}</>
            },
            ul({ children }) {
              return <ul className="my-2 list-disc pl-6">{children}</ul>
            },
            ol({ children }) {
              return <ol className="my-2 list-decimal pl-6">{children}</ol>
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-2 border-l-4 border-gray-300 pl-4 italic dark:border-gray-600">
                  {children}
                </blockquote>
              )
            },
            h1({ children }) {
              return <h1 className="mb-2 mt-4 text-xl font-bold">{children}</h1>
            },
            h2({ children }) {
              return <h2 className="mb-2 mt-3 text-lg font-semibold">{children}</h2>
            },
            h3({ children }) {
              return <h3 className="mb-1 mt-2 text-base font-semibold">{children}</h3>
            },
            p({ children }) {
              return <p className="my-2">{children}</p>
            },
            a({ href, children }) {
              return (
                <a 
                  href={href} 
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              )
            }
          }}
        >
          {part.text}
        </ReactMarkdown>
      </div>
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
      <div className="my-2 rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950 overflow-hidden">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
          {getToolIcon()}
          <span>Tool: {toolName}</span>
          <span className="text-xs opacity-60">({part.toolCallId})</span>
        </div>
        
        {'input' in part && (
          <div className="mt-2 min-w-0">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Input:</div>
            <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap break-all">
              <code>{JSON.stringify(part.input, null, 2)}</code>
            </pre>
          </div>
        )}
        
        {hasOutput && (
          <div className="mt-2 min-w-0">
            <div className="text-xs font-medium text-green-700 dark:text-green-300">Output:</div>
            {(() => {
              if (toolName === 'read_file' && 'output' in part && part.output) {
                const output = part.output as FileOutput
                if (output.content?.[0]?.text) {
                  return (
                    <pre className="mt-1 rounded bg-gray-100 p-2 dark:bg-gray-800 text-xs max-h-60 overflow-auto">
                      <code>{output.content[0].text}</code>
                    </pre>
                  )
                }
              }
              return (
                <pre className="mt-1 text-xs max-h-40 overflow-auto whitespace-pre-wrap break-all">
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
    <div className="my-2 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
      <div className="text-xs text-muted-foreground">
        Unknown part type: {part.type}
      </div>
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
  return (
    <div className="flex justify-start">
      <div className="rounded-lg bg-muted px-4 py-2 overflow-hidden">
        <div className="space-y-1">
          {message.parts.map((part, index) => (
            <MessagePart key={index} part={part} />
          ))}
        </div>
      </div>
    </div>
  )
}