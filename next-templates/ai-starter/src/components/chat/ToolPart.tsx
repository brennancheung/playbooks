import { Wrench, FileText, FileEdit, FolderOpen } from 'lucide-react'
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
  if (!part.type.startsWith('tool-') || !('toolCallId' in part)) {
    return null
  }

  const toolName = part.type.replace('tool-', '')
  const hasOutput = 'output' in part && part.state === 'output-available'
  const hasError = 'errorText' in part && part.state === 'output-error'
  const hasInput = 'input' in part

  return (
    <div className="my-2 rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950 overflow-hidden">
      <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
        {getToolIcon(toolName)}
        <span>Tool: {toolName}</span>
        <span className="text-xs opacity-60">({part.toolCallId})</span>
      </div>

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
  )
}