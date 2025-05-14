import { experimental_createMCPClient as createMCPClient } from "ai"

export interface KeyValuePair {
  key: string
  value: string
}

export interface MCPServerConfig {
  url: string
  type: "sse" | "http"
  command?: string
  args?: string[]
  env?: KeyValuePair[]
  headers?: KeyValuePair[]
}

export interface MCPClientManager {
  tools: Record<string, any>
  clients: any[]
  serverTools: Record<string, string[]>
  cleanup: () => Promise<void>
}

/**
 * Wait for an MCP server to be ready
 */
async function waitForServerReady(url: string, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        console.log(`Server ready at ${url} after ${i + 1} attempts`)
        return true
      }
      console.log(`Server not ready yet (attempt ${i + 1}), status: ${response.status}`)
    } catch {
      console.log(`Server connection failed (attempt ${i + 1})`)
    }
    // Wait 6 seconds between attempts
    await new Promise((resolve) => setTimeout(resolve, 6000))
  }
  return false
}

/**
 * Initialize MCP clients for API calls
 * This handles both SSE and HTTP transport types
 */
export async function initializeMCPClients(
  mcpServers: MCPServerConfig[] = [],
  abortSignal?: AbortSignal,
): Promise<MCPClientManager> {
  // Initialize tools
  let tools = {}
  const mcpClients: any[] = []
  const serverTools: Record<string, string[]> = {}

  // Process each MCP server configuration
  for (const mcpServer of mcpServers) {
    try {
      // Process headers to ensure they're in the correct format
      let headers: Record<string, string> = {};
      
      if (mcpServer.headers) {
        // If it's an array of KeyValuePair objects
        if (Array.isArray(mcpServer.headers)) {
          try {
            headers = mcpServer.headers.reduce(
              (acc, header) => {
                if (header && typeof header === 'object' && 'key' in header) {
                  acc[header.key] = header.value || "";
                }
                return acc;
              },
              {} as Record<string, string>
            );
          } catch (error) {
            console.error("Failed to process headers:", error);
            // Continue with empty headers
          }
        } 
        // If it's already a direct object
        else if (typeof mcpServer.headers === 'object') {
          headers = mcpServer.headers as Record<string, string>;
        }
      }

      // Create transport config based on server type
      // For now, treat 'http' type as 'sse' for compatibility with AI SDK
      const transport = {
        type: "sse" as const, // Always use 'sse' as the transport type for AI SDK
        url: mcpServer.url,
        headers,
      }

      // Create the MCP client with the transport configuration
      const mcpClient = await createMCPClient({ transport })
      
      // Get the tools from the client
      const mcptools = await mcpClient.tools()
      
      // Only add the client to the list if we successfully got tools
      if (mcptools && Object.keys(mcptools).length > 0) {
        mcpClients.push(mcpClient)
        
        // Store tools on the server object to display in UI
        const foundToolNames = Object.keys(mcptools)
        console.log(`MCP tools from ${mcpServer.url}:`, foundToolNames)
        
        // Save the tools for this server
        serverTools[mcpServer.url] = foundToolNames
        
        // Add MCP tools to tools object
        tools = { ...tools, ...mcptools }
      } else {
        // If no tools were found, close the client
        try {
          await mcpClient.close()
        } catch (error) {
          console.error("Error closing MCP client with no tools:", error)
        }
      }
    } catch (error) {
      console.error("Failed to initialize MCP client:", error)
      // Continue with other servers instead of failing the entire request
    }
  }

  // Register cleanup for all clients if an abort signal is provided
  if (abortSignal && mcpClients.length > 0) {
    abortSignal.addEventListener("abort", async () => {
      await cleanupMCPClients(mcpClients)
    })
  }

  return {
    tools,
    clients: mcpClients,
    serverTools,
    cleanup: async () => await cleanupMCPClients(mcpClients),
  }
}

/**
 * Clean up MCP clients
 */
async function cleanupMCPClients(clients: any[]): Promise<void> {
  if (!clients || clients.length === 0) {
    return;
  }
  
  // Clean up the MCP clients
  const closePromises = clients.map(async (client) => {
    if (!client) return;
    
    try {
      await client.close();
    } catch (error) {
      console.error("Error closing MCP client:", error);
    }
  });
  
  // Wait for all clients to close
  await Promise.all(closePromises);
}
