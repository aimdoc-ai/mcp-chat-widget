import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { initializeMCPClients, type MCPServerConfig } from "@/lib/mcp-client"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, provider = "openai", mcpServers = [] } = await req.json()

  // Initialize MCP clients if provided
  let mcpTools = {}
  let mcpManager = null

  if (mcpServers && mcpServers.length > 0) {
    try {
      mcpManager = await initializeMCPClients(mcpServers as MCPServerConfig[])
      mcpTools = mcpManager.tools
    } catch (error) {
      console.error("Failed to initialize MCP clients:", error)
    }
  }

  try {
    // Select the appropriate model based on provider
    let model

    switch (provider) {
      case "anthropic":
        model = anthropic("claude-3-5-sonnet-latest")
        break
      case "openai":
      default:
        model = openai("gpt-4o")
        break
    }

    // Stream the response
    const result = streamText({
      model,
      messages,
      tools: Object.keys(mcpTools).length > 0 ? mcpTools : undefined,
    })

    return result.toDataStreamResponse()
  } finally {
    // Clean up MCP clients
    if (mcpManager) {
      await mcpManager.cleanup()
    }
  }
}
