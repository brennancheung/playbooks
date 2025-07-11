import { useState } from 'react'
import { Wrench, FileText, FileEdit, FolderOpen, ChevronDown, ChevronRight, Loader2, CheckCircle, XCircle } from 'lucide-react'
import type { UIMessage } from '@ai-sdk/react'

interface FileOutput {
  content: Array<{ type: string; text: string }>
  isError?: boolean
}

interface ToolPartProps {
  part: UIMessage['parts'][number]
}

const getToolIcon = (toolName: string) => {
  if (toolName.includes('read')) return <FileText className="h-4 w-4" />
  if (toolName.includes('write')) return <FileEdit className="h-4 w-4" />
  if (toolName.includes('list')) return <FolderOpen className="h-4 w-4" />
  return <Wrench className="h-4 w-4" />
}

const getStatusIcon = (state: string | undefined) => {
  if (state === 'output-available') return <CheckCircle className="h-3 w-3 text-green-600" />
  if (state === 'output-error') return <XCircle className="h-3 w-3 text-red-600" />
  if (state === 'output-pending') return <Loader2 className="h-3 w-3 animate-spin" />
  return null
}

const renderFileOutput = (output: FileOutput) => {
  const hasTextContent = output.content?.[0]?.text
  
  if (!hasTextContent) {
    return null
  }
  
  return (
    <pre className="mt-1 rounded bg-gray-100 p-2 dark:bg-gray-800 text-xs max-h-60 overflow-auto">
      <code>{output.content[0].text}</code>
    </pre>
  )
}

const renderGenericOutput = (output: unknown) => {
  return (
    <pre className="mt-1 text-xs max-h-40 overflow-auto whitespace-pre-wrap break-all">
      <code>{JSON.stringify(output, null, 2)}</code>
    </pre>
  )
}

const renderOutput = (toolName: string, output: unknown) => {
  if (toolName === 'read_file' && output) {
    const fileOutput = renderFileOutput(output as FileOutput)
    if (fileOutput) {
      return fileOutput
    }
  }
  
  return renderGenericOutput(output)
}

export function ToolPart({ part }: ToolPartProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!part.type.startsWith('tool-') || !('toolCallId' in part)) {
    return null
  }

  const toolName = part.type.replace('tool-', '')
  const hasOutput = 'output' in part && part.state === 'output-available'
  const hasError = 'errorText' in part && part.state === 'output-error'
  const hasInput = 'input' in part
  const state = 'state' in part ? part.state : undefined

  return (
    <div className="my-2 rounded border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center gap-2 text-left hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
      >
        <div className="flex-1 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {getToolIcon(toolName)}
          <span>Tool: {toolName}</span>
          <span className="text-xs opacity-60">({part.toolCallId})</span>
        </div>
        {getStatusIcon(state)}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3">
          {hasInput && (
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
              {renderOutput(toolName, part.output)}
            </div>
          )}

          {hasError && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">Error: {part.errorText}</div>
          )}
        </div>
      )}
    </div>
  )
}