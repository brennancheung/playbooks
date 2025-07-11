'use server'

import { getMCPManager } from '@/lib/mcp-manager'
import { loadMCPServersConfig } from '@/config/mcp-servers'

export async function initializeMCP() {
  const mcpManager = getMCPManager()
  
  if (mcpManager.isInitialized()) {
    const connections = mcpManager.getActiveConnections()
    return { 
      success: true, 
      message: 'MCP already initialized',
      serverCount: connections.length
    }
  }

  try {
    console.log('Initializing MCP connections...')
    const serversConfig = loadMCPServersConfig()
    
    await mcpManager.initialize(serversConfig)
    
    const connections = mcpManager.getActiveConnections()
    console.log(`MCP initialized with ${connections.length} active servers:`)
    connections.forEach(conn => {
      console.log(`  - ${conn.name}: ${Object.keys(conn.tools).length} tools`)
    })
    
    return { 
      success: true, 
      message: `Initialized ${connections.length} MCP servers`,
      serverCount: connections.length
    }
  } catch (error) {
    console.error('Failed to initialize MCP:', error)
    return { 
      success: false, 
      message: 'Failed to initialize MCP servers',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getMCPStatus() {
  const mcpManager = getMCPManager()
  
  // Ensure MCP is initialized
  if (!mcpManager.isInitialized()) {
    await initializeMCP()
  }
  
  const config = loadMCPServersConfig()
  const connections = mcpManager.getActiveConnections()
  
  // Build status for all configured servers
  const servers = Object.entries(config).map(([name, serverConfig]) => {
    const connection = connections.find(c => c.name === name)
    
    return {
      name,
      connected: !!connection,
      toolCount: connection ? Object.keys(connection.tools).length : 0,
      description: serverConfig.description
    }
  })
  
  return {
    servers,
    totalTools: connections.reduce((sum, conn) => sum + Object.keys(conn.tools).length, 0)
  }
}

export async function getMCPServerTools(serverName: string) {
  const mcpManager = getMCPManager()
  const connection = mcpManager.getConnection(serverName)
  
  if (!connection) {
    throw new Error(`Server "${serverName}" not found or not connected`)
  }
  
  // Get detailed tool information
  const tools = Object.entries(connection.tools).map(([name, tool]) => {
    const toolData = tool as Record<string, unknown>
    
    // Extract the JSON schema from the parameters, avoiding non-serializable properties
    let parameters: Record<string, unknown> = {}
    const paramData = toolData.inputSchema || toolData.parameters
    
    if (paramData && typeof paramData === 'object') {
      // If it has a jsonSchema property, use that (it's already serializable)
      const paramObj = paramData as Record<string, unknown>
      if ('jsonSchema' in paramObj && paramObj.jsonSchema) {
        parameters = paramObj.jsonSchema as Record<string, unknown>
      } else {
        // Otherwise, try to extract serializable properties
        try {
          parameters = JSON.parse(JSON.stringify(paramData))
        } catch {
          parameters = {}
        }
      }
    }
    
    return {
      name,
      description: String(toolData.description || 'No description available'),
      parameters,
      displayName: name
    }
  })
  
  return {
    server: serverName,
    tools,
    totalTools: tools.length
  }
}