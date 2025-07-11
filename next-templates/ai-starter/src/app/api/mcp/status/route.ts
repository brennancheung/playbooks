import { NextResponse } from 'next/server'
import { getMCPManager } from '@/lib/mcp-manager'
import { loadMCPServersConfig } from '@/config/mcp-servers'

export async function GET() {
  try {
    const mcpManager = getMCPManager()
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
    
    return NextResponse.json({
      servers,
      totalTools: connections.reduce((sum, conn) => sum + Object.keys(conn.tools).length, 0)
    })
  } catch (error) {
    console.error('Error getting MCP status:', error)
    return NextResponse.json(
      { error: 'Failed to get MCP status' },
      { status: 500 }
    )
  }
}