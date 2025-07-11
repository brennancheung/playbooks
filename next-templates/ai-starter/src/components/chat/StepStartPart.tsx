import type { UIMessage } from '@ai-sdk/react'

interface StepStartPartProps {
  part: UIMessage['parts'][number]
}

export function StepStartPart(_props: StepStartPartProps) {
  // Don't render step-start parts - they're just internal markers
  return null
}