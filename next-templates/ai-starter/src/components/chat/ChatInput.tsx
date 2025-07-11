import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  status: string
}

const INPUT_PLACEHOLDER = "Type your message..."
const INPUT_HELP_TEXT = "Press Enter to send, Shift+Enter for new line"

export function ChatInput({ input, setInput, handleSubmit, status }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={INPUT_PLACEHOLDER}
          className="min-h-[60px] resize-none"
          onKeyDown={handleKeyDown}
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
        {INPUT_HELP_TEXT}
      </p>
    </form>
  )
}