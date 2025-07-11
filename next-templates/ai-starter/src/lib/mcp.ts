// Re-export the MCP types and functions from the AI SDK
import { experimental_createMCPClient as createMCPClient } from 'ai'

export { createMCPClient }
export type MCPClient = Awaited<ReturnType<typeof createMCPClient>>