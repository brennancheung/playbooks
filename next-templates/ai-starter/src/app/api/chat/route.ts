import { streamText } from 'ai'
/*
import { createOpenAI } from "@ai-sdk/openai"

// Create OpenAI provider with explicit API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
*/

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
  })

  return result.toTextStreamResponse()
}
