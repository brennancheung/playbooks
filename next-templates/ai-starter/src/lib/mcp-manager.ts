import { createMCPClient } from '@/lib/mcp'
import { StdioMCPTransport } from '@/lib/mcp-stdio-transport'
import type { MCPClient } from '@/lib/mcp'
import type { MCPServerConfig, MCPServersConfig } from '@/config/mcp-servers'

export interface MCPConnection {
  name: string
  client: MCPClient
  config: MCPServerConfig
  tools: Record<string, unknown>
}

export class MCPManager {
  private connections: Map<string, MCPConnection> = new Map()
  private initialized = false

  async initialize(serversConfig: MCPServersConfig) {
    if (this.initialized) {
      console.warn('MCPManager already initialized')
      return
    }

    console.log(`Initializing MCP Manager with ${Object.keys(serversConfig).length} servers`)

    // Initialize all servers in parallel
    const initPromises = Object.entries(serversConfig).map(async ([name, config]) => {
      try {
        console.log(`Connecting to MCP server: ${name}`)
        
        const client = await createMCPClient({
          transport: new StdioMCPTransport({
            command: config.command,
            args: config.args,
            env: config.env
          })
        })

        const tools = await client.tools()
        const toolCount = Object.keys(tools).length
        console.log(`MCP server "${name}" connected with ${toolCount} tools`)

        this.connections.set(name, {
          name,
          client,
          config,
          tools
        })
      } catch (error) {
        console.error(`Failed to connect to MCP server "${name}":`, error)
        // Don't throw - allow other servers to connect
      }
    })

    await Promise.allSettled(initPromises)
    this.initialized = true

    console.log(`MCP Manager initialized with ${this.connections.size} active connections`)
  }

  isInitialized(): boolean {
    return this.initialized
  }

  getActiveConnections(): MCPConnection[] {
    return Array.from(this.connections.values())
  }

  getConnection(name: string): MCPConnection | undefined {
    return this.connections.get(name)
  }
  
  getConnectionTools(name: string): Record<string, unknown> | undefined {
    const connection = this.connections.get(name)
    return connection?.tools
  }

  getAllTools() {
    // Merge all tools from all connections with server name prefix
    const allTools: Record<string, unknown> = {}
    
    for (const connection of this.connections.values()) {
      // Add server name prefix to avoid tool name conflicts
      for (const [toolName, tool] of Object.entries(connection.tools)) {
        const prefixedName = `${connection.name}__${toolName}`
        allTools[prefixedName] = tool
      }
    }
    
    return allTools
  }

  async close() {
    console.log('Closing all MCP connections...')
    
    const closePromises = Array.from(this.connections.values()).map(async connection => {
      try {
        await connection.client.close()
        console.log(`Closed connection to "${connection.name}"`)
      } catch (error) {
        console.error(`Error closing connection to "${connection.name}":`, error)
      }
    })

    await Promise.allSettled(closePromises)
    this.connections.clear()
    this.initialized = false
  }
}

// Singleton instance
let mcpManager: MCPManager | null = null

export function getMCPManager(): MCPManager {
  if (!mcpManager) {
    mcpManager = new MCPManager()
  }
  return mcpManager
}