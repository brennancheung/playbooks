import { streamText, stepCountIs, convertToModelMessages } from 'ai'
/*
import { createOpenAI } from "@ai-sdk/openai"

// Create OpenAI provider with explicit API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
*/

import { experimental_createMCPClient as createMCPClient } from 'ai'
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio'

// MCP client management
type MCPClient = Awaited<ReturnType<typeof createMCPClient>>

let mcpClient: MCPClient | null

async function getMCPTools() {
  try {
    // If we don't have a client, create one
    if (!mcpClient) {
      console.log('Creating new MCP client...')
      mcpClient = await createMCPClient({
        transport: new StdioMCPTransport({
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', './'],
        }),
      })
      console.log('MCP client created successfully')
    }
    return await mcpClient.tools()
  } catch (error) {
    console.error('Failed to create/get MCP tools:', error)
    // Reset to null so we'll retry on next request
    mcpClient = null
    return null
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Try to get MCP tools, but continue without them if unavailable
  const mcpTools = await getMCPTools()

  const result = streamText({
    model: 'anthropic/claude-3.7-sonnet',
    messages: convertToModelMessages(messages),
    temperature: 0.7,
    tools: mcpTools || {},
    stopWhen: stepCountIs(15),
  })

  return result.toUIMessageStreamResponse()
}
