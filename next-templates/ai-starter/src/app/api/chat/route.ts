import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { getMCPManager } from '@/lib/mcp-manager'
import { loadMCPServersConfig } from '@/config/mcp-servers'

// Initialize MCP manager once
let mcpInitialized = false

async function initializeMCPIfNeeded() {
  if (mcpInitialized) return

  try {
    console.log('Initializing MCP connections...')
    const mcpManager = getMCPManager()
    const serversConfig = loadMCPServersConfig()
    
    await mcpManager.initialize(serversConfig)
    mcpInitialized = true
    
    const connections = mcpManager.getActiveConnections()
    console.log(`MCP initialized with ${connections.length} active servers:`)
    connections.forEach(conn => {
      console.log(`  - ${conn.name}: ${conn.tools.length} tools`)
    })
  } catch (error) {
    console.error('Failed to initialize MCP:', error)
    // Don't set initialized to true so we can retry
  }
}

async function getMCPTools() {
  try {
    await initializeMCPIfNeeded()
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