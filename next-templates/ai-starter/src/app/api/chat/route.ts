import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { getMCPManager } from '@/lib/mcp-manager'
import { initializeMCP } from '@/lib/mcp-actions'

async function getMCPTools() {
  try {
    await initializeMCP()
    const mcpManager = getMCPManager()
    return mcpManager.getAllTools()
  } catch (error) {
    console.error('Failed to get MCP tools:', error)
    return {}
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Try to get MCP tools, but continue without them if unavailable
  const mcpTools = await getMCPTools()
  
  console.log(`Processing chat request with ${Object.keys(mcpTools).length} available tools`)

  const result = streamText({
    model: 'anthropic/claude-3.7-sonnet',
    messages: convertToModelMessages(messages),
    temperature: 0.7,
    tools: mcpTools as Parameters<typeof streamText>[0]['tools'],
    stopWhen: stepCountIs(25),
  })

  return result.toUIMessageStreamResponse()
}