import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { UIMessage } from '@ai-sdk/react'
import { markdownComponents } from './MarkdownComponents'

interface TextPartProps {
  part: UIMessage['parts'][number]
}

export function TextPart({ part }: TextPartProps) {
  if (part.type !== 'text' || !('text' in part)) {
    return null
  }

  const isDone = 'state' in part && part.state === 'done'

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${!isDone ? 'opacity-70' : ''}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {part.text}
      </ReactMarkdown>
    </div>
  )
}