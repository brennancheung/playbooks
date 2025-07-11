'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatView } from '@/components/chat/ChatView'
import { DebugView } from '@/components/chat/DebugView'
import { MCPStatus } from '@/components/chat/MCPStatus'

export default function ChatDemo() {
  const { messages, sendMessage, status } = useChat()
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== 'ready') return

    sendMessage({ text: input })
    setInput('')
  }

  const handleMessageSent = () => {
    // This callback is called when a message is successfully sent
    // Could be used for analytics or other side effects
  }

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <h1 className="text-3xl font-bold mb-6">Streaming MCP Chat Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <ChatView
          messages={messages}
          status={status}
          handleSubmit={handleSubmit}
          input={input}
          setInput={setInput}
          onMessageSent={handleMessageSent}
        />
        
        <div className="space-y-6">
          <MCPStatus />
          <DebugView messages={messages} />
        </div>
      </div>
    </div>
  )
}