export interface MCPServerConfig {
  command: string
  args: string[]
  env?: Record<string, string>
  description?: string
  enabled?: boolean
}

export interface MCPServersConfig {
  [serverName: string]: MCPServerConfig
}

// Default MCP servers configuration
// This mimics the Claude Desktop config format
export const defaultMCPServers: MCPServersConfig = {
  filesystem: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', './'],
    description: 'File system access for reading and writing files',
    enabled: true
  },
  github: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || ''
    },
    description: 'GitHub API access for repositories, issues, and PRs',
    enabled: false // Disabled by default, enable when token is available
  },
  sqlite: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sqlite', '--db-path', './data/app.db'],
    description: 'SQLite database access',
    enabled: false
  },
  postgres: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres'],
    env: {
      DATABASE_URL: process.env.DATABASE_URL || ''
    },
    description: 'PostgreSQL database access',
    enabled: false
  },
  firecrawl: {
    command: 'npx',
    args: ['-y', 'firecrawl-mcp'],
    env: {
      FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || ''
    },
    description: 'Web scraping and crawling capabilities',
    enabled: true
  }
}

// Load custom config from environment or file
export function loadMCPServersConfig(): MCPServersConfig {
  // In a production app, you might load this from:
  // 1. Environment variables (MCP_SERVERS_CONFIG)
  // 2. A JSON file in the project root
  // 3. A database
  // 4. An admin UI
  
  // For now, we'll use the default config and filter enabled servers
  const config: MCPServersConfig = {}
  
  for (const [name, server] of Object.entries(defaultMCPServers)) {
    if (server.enabled !== false) {
      // Check if required env vars are present
      if (server.env) {
        const hasAllEnvVars = Object.values(server.env).every(value => value !== '')
        if (!hasAllEnvVars) {
          console.warn(`Skipping MCP server "${name}" due to missing environment variables`)
          continue
        }
      }
      config[name] = server
    }
  }
  
  return config
}