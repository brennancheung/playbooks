import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Server, CheckCircle, XCircle, Loader2, ChevronRight, ChevronDown, Wrench } from 'lucide-react'
import { getMCPStatus, getMCPServerTools, initializeMCP } from '@/lib/mcp-actions'

interface MCPServerStatus {
  name: string
  connected: boolean
  toolCount: number
  description?: string
}

interface Tool {
  name: string
  displayName: string
  description: string
  parameters: Record<string, unknown>
}

interface ExpandedServer {
  name: string
  tools: Tool[]
  loading: boolean
}

export function MCPStatus() {
  const [servers, setServers] = useState<MCPServerStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedServers, setExpandedServers] = useState<Record<string, ExpandedServer>>({})

  useEffect(() => {
    // Initialize and fetch MCP server status
    const initAndFetchStatus = async () => {
      try {
        // First ensure MCP is initialized
        const initResult = await initializeMCP()
        console.log('MCP initialization result:', initResult)
        
        // Then fetch the status
        const data = await getMCPStatus()
        setServers(data.servers)
      } catch (error) {
        console.error('Failed to initialize/fetch MCP status:', error)
      } finally {
        setLoading(false)
      }
    }

    initAndFetchStatus()
    
    // Set up refresh interval (only fetch status, not reinitialize)
    const interval = setInterval(async () => {
      try {
        const data = await getMCPStatus()
        setServers(data.servers)
      } catch (error) {
        console.error('Failed to refresh MCP status:', error)
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const toggleServer = async (serverName: string) => {
    // If already expanded, collapse it
    if (expandedServers[serverName]) {
      setExpandedServers(prev => {
        const next = { ...prev }
        delete next[serverName]
        return next
      })
      return
    }

    // Otherwise, expand and load tools
    setExpandedServers(prev => ({
      ...prev,
      [serverName]: { name: serverName, tools: [], loading: true }
    }))

    try {
      const data = await getMCPServerTools(serverName)
      setExpandedServers(prev => ({
        ...prev,
        [serverName]: { name: serverName, tools: data.tools, loading: false }
      }))
    } catch (error) {
      console.error(`Failed to load tools for ${serverName}:`, error)
      setExpandedServers(prev => ({
        ...prev,
        [serverName]: { name: serverName, tools: [], loading: false }
      }))
    }
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading MCP servers...</span>
        </div>
      </Card>
    )
  }

  const connectedCount = servers.filter(s => s.connected).length

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Server className="h-4 w-4" />
            MCP Servers
          </h3>
          <Badge variant={connectedCount > 0 ? "default" : "secondary"}>
            {connectedCount}/{servers.length} connected
          </Badge>
        </div>
        
        <div className="space-y-2">
          {servers.map(server => {
            const isExpanded = !!expandedServers[server.name]
            const expandedData = expandedServers[server.name]
            
            return (
              <div key={server.name} className="space-y-2">
                <button
                  onClick={() => server.connected && toggleServer(server.name)}
                  disabled={!server.connected}
                  className={`w-full flex items-center justify-between text-sm p-2 -m-2 rounded transition-colors ${
                    server.connected 
                      ? 'hover:bg-muted/50 cursor-pointer' 
                      : 'cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {server.connected && (
                      isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                    )}
                    {server.connected ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                    <span className={server.connected ? '' : 'text-muted-foreground'}>
                      {server.name}
                    </span>
                  </div>
                  {server.connected && (
                    <span className="text-xs text-muted-foreground">
                      {server.toolCount} tools
                    </span>
                  )}
                </button>
                
                {isExpanded && expandedData && (
                  <div className="ml-6 space-y-1 border-l pl-4">
                    {server.description && (
                      <div className="text-xs text-muted-foreground pb-2 italic">
                        {server.description}
                      </div>
                    )}
                    {expandedData.loading ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs text-muted-foreground">Loading tools...</span>
                      </div>
                    ) : expandedData.tools.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-2">No tools available</div>
                    ) : (
                      expandedData.tools.map(tool => (
                        <div key={tool.name} className="py-1">
                          <div className="flex items-start gap-2">
                            <Wrench className="h-3 w-3 mt-0.5 text-muted-foreground" />
                            <div className="flex-1 space-y-1">
                              <div className="text-xs font-medium">{tool.displayName}</div>
                              <div className="text-xs text-muted-foreground">{tool.description}</div>
                              {tool.parameters && Object.keys(tool.parameters).length > 0 && (
                                <details className="text-xs">
                                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                    Parameters
                                  </summary>
                                  <pre className="mt-1 p-2 bg-muted rounded overflow-x-auto">
                                    <code>{JSON.stringify(tool.parameters, null, 2)}</code>
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}