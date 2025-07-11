'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Send } from 'lucide-react'
import { UserMessage, AssistantMessage } from '@/components/chat/ChatMessageComponents'

export default function ChatDemo() {
  const { messages, sendMessage, status } = useChat()
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== 'ready') return

    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="container mx-auto max-w p-4">
      <h1 className="text-3xl font-bold mb-6">Streaming Chat Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="min-h-[70vh] max-h-[80vh] flex flex-col">
          <ScrollArea className="flex-1 p-4 overflow-auto">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation by typing a message below
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === 'user' ? (
                      <UserMessage message={message} />
                    ) : (
                      <AssistantMessage message={message} />
                    )}
                  </div>
                ))}
                {status === 'streaming' && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as React.FormEvent)
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!input.trim() || status !== 'ready'}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                {status === 'streaming' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </form>
        </Card>
        
        {/* Debug View */}
        <Card className="min-h-[70vh] max-h-[80vh] flex flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Debug View</h2>
            <p className="text-sm text-muted-foreground">Raw message structure</p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="rounded border p-3">
                  <div className="mb-2 text-sm font-medium">
                    Role: {message.role} | Parts: {message.parts.length}
                  </div>
                  <pre className="overflow-auto text-xs">
                    <code>{JSON.stringify(message.parts, null, 2)}</code>
                  </pre>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
