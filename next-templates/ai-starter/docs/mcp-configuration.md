# MCP (Model Context Protocol) Configuration

This Next.js application supports multiple MCP servers, allowing the AI to interact with various tools and services.

## Overview

MCP servers are configured in `src/config/mcp-servers.ts`. The configuration format is inspired by Claude Desktop's configuration but adapted for Next.js serverless environment.

## Configuration Format

Each MCP server is defined with the following properties:

```typescript
{
  command: string      // Command to execute (e.g., 'npx')
  args: string[]      // Command arguments
  env?: Record<string, string>  // Environment variables
  description?: string // Human-readable description
  enabled?: boolean   // Whether to enable this server
}
```

## Default Servers

The application comes with several pre-configured MCP servers:

### 1. Filesystem Server
- **Name**: `filesystem`
- **Description**: File system access for reading and writing files
- **Enabled**: Yes (by default)
- **Tools**: read_file, write_file, list_directory, etc.

### 2. GitHub Server
- **Name**: `github`
- **Description**: GitHub API access for repositories, issues, and PRs
- **Enabled**: No (requires GITHUB_TOKEN environment variable)
- **Tools**: create_issue, list_repos, create_pr, etc.

### 3. SQLite Server
- **Name**: `sqlite`
- **Description**: SQLite database access
- **Enabled**: No (requires database path configuration)
- **Tools**: query, execute, list_tables, etc.

### 4. PostgreSQL Server
- **Name**: `postgres`
- **Description**: PostgreSQL database access
- **Enabled**: No (requires DATABASE_URL environment variable)
- **Tools**: query, execute, list_tables, etc.

### 5. Firecrawl Server
- **Name**: `firecrawl`
- **Description**: Web scraping and crawling capabilities
- **Enabled**: No (requires FIRECRAWL_API_KEY environment variable)
- **Tools**: scrape_url, crawl_website, search, etc.

## Enabling Additional Servers

To enable additional MCP servers:

1. **Set Required Environment Variables**
   ```bash
   # For GitHub server
   GITHUB_TOKEN=your_github_token

   # For PostgreSQL server
   DATABASE_URL=postgresql://user:password@localhost/dbname

   # For Firecrawl server
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   ```

2. **Update the Configuration**
   Edit `src/config/mcp-servers.ts` to set `enabled: true` for the desired servers.

3. **Restart the Application**
   The servers will be initialized on the next request.

## Adding Custom MCP Servers

To add a new MCP server:

1. **Add to Configuration**
   ```typescript
   export const defaultMCPServers: MCPServersConfig = {
     // ... existing servers ...
     myCustomServer: {
       command: 'node',
       args: ['/path/to/my-mcp-server.js'],
       env: {
         API_KEY: process.env.MY_API_KEY || ''
       },
       description: 'My custom MCP server',
       enabled: true
     }
   }
   ```

2. **Install the Server Package** (if using npm package)
   ```bash
   pnpm add @myorg/mcp-server-custom
   ```

## Tool Naming Convention

To avoid conflicts between servers that might have similarly named tools, all tools are prefixed with their server name:

- Filesystem server's `read_file` becomes `filesystem__read_file`
- GitHub server's `create_issue` becomes `github__create_issue`

This prefixing happens automatically and is transparent to the AI model.

## Monitoring MCP Status

The application includes an MCP status component that shows:
- Which servers are connected
- How many tools each server provides
- Real-time connection status

This is displayed in the chat UI and updates every 30 seconds.

## Troubleshooting

### Server Not Connecting
1. Check the console logs for error messages
2. Verify required environment variables are set
3. Ensure the MCP server package is installed
4. Check that the command and args are correct

### Missing Tools
1. Verify the server is connected (check MCP status)
2. Check that the server actually provides the expected tools
3. Look for errors in the console during initialization

### Performance Issues
- MCP servers are initialized once and connections are reused
- In serverless environments, connections may need to be re-established
- Consider disabling unused servers to reduce initialization time