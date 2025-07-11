import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { UserMessage, AssistantMessage, MessagePart } from '@/components/chat/ChatMessageComponents'
import { ChatInput } from '@/components/chat/ChatInput'
import { useScrollManagement } from '@/hooks/useScrollManagement'
import type { UIMessage } from '@ai-sdk/react'

interface ChatViewProps {
  messages: UIMessage[]
  status: string
  handleSubmit: (e: React.FormEvent) => void
  input: string
  setInput: (value: string) => void
  onMessageSent: () => void
}

const EMPTY_CHAT_MESSAGE = 'Start a conversation by typing a message below'

function EmptyState() {
  return <div className="text-center text-muted-foreground py-8">{EMPTY_CHAT_MESSAGE}</div>
}

function StreamingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg px-4 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    </div>
  )
}

function MessageContent({ message }: { message: UIMessage }) {
  if (message.role === 'user') {
    return <UserMessage message={message} />
  }

  return (
    <>
      {message.parts.map((part, index) => {
        if (part.type === 'text') {
          return <AssistantMessage key={index} message={{ ...message, parts: [part] }} />
        }

        if (part.type.startsWith('tool-')) {
          return (
            <div key={index} className="flex justify-start">
              <MessagePart part={part} />
            </div>
          )
        }

        return null
      })}
    </>
  )
}

function MessageList({ messages, status }: { messages: UIMessage[]; status: string }) {
  if (messages.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
          <MessageContent message={message} />
        </div>
      ))}
      {status === 'streaming' && <StreamingIndicator />}
    </div>
  )
}

export function ChatView({
  messages,
  status,
  handleSubmit,
  input,
  setInput,
  onMessageSent,
}: ChatViewProps) {
  const { scrollRef, handleScroll, resetScroll } = useScrollManagement([messages])

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e)
    if (input.trim() && status === 'ready') {
      resetScroll()
      onMessageSent()
    }
  }

  return (
    <Card className="min-h-[70vh] max-h-[80vh] flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto p-4">
          <MessageList messages={messages} status={status} />
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleFormSubmit}
        status={status}
      />
    </Card>
  )
}
