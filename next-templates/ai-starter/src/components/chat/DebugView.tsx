import { Card } from '@/components/ui/card'
import { useScrollManagement } from '@/hooks/useScrollManagement'
import type { UIMessage } from '@ai-sdk/react'

interface DebugViewProps {
  messages: UIMessage[]
}

export function DebugView({ messages }: DebugViewProps) {
  const { scrollRef, handleScroll } = useScrollManagement([messages])
  return (
    <Card className="min-h-[70vh] max-h-[80vh] flex flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Debug View</h2>
        <p className="text-sm text-muted-foreground">Raw message structure</p>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto p-4"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="rounded border p-3 overflow-hidden">
                <div className="mb-2 text-sm font-medium">
                  Role: {message.role} | Parts: {message.parts.length}
                </div>
                <div className="overflow-auto max-h-96">
                  <pre className="text-xs">
                    <code>{JSON.stringify(message.parts, null, 2)}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}