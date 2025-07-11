import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Server, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface MCPServerStatus {
  name: string
  connected: boolean
  toolCount: number
  description?: string
}

export function MCPStatus() {
  const [servers, setServers] = useState<MCPServerStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch MCP server status from API
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/mcp/status')
        if (response.ok) {
          const data = await response.json()
          setServers(data.servers)
        }
      } catch (error) {
        console.error('Failed to fetch MCP status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

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
          {servers.map(server => (
            <div key={server.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
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
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}