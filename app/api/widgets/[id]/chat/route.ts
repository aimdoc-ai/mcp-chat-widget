import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { widgets, widgetConversations, widgetMessages } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { initializeMCPClients } from "@/lib/mcp-client"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export const maxDuration = 30

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const widgetId = Number.parseInt(unwrappedParams.id)
    const { messages } = await request.json()

    // Get the widget configuration
    const widget = await db.query.widgets.findFirst({
      where: eq(widgets.id, widgetId),
      with: {
        mcpServers: true,
      },
    })

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    // Get or create a session ID from cookies
    const cookieStore = await cookies()
    let sessionId = cookieStore.get(`widget_${widgetId}_session`)?.value

    if (!sessionId) {
      sessionId = uuidv4()
      // In a real implementation, you'd set the cookie in the response
    }

    // Get or create a conversation for this session
    let conversation = await db.query.widgetConversations.findFirst({
      where: and(eq(widgetConversations.widgetId, widgetId), eq(widgetConversations.sessionId, sessionId)),
    })

    if (!conversation) {
      const [newConversation] = await db
        .insert(widgetConversations)
        .values({
          widgetId,
          sessionId,
        })
        .returning()

      conversation = newConversation
    }

    // Initialize MCP clients if the widget has MCP servers
    let mcpTools = {}
    let mcpManager = null

    if (widget.mcpServers && widget.mcpServers.length > 0) {
      try {
        const mcpServers = widget.mcpServers.map((server) => ({
          url: server.url,
          type: server.type as "sse" | "http",
          headers: server.headers as any,
        }))

        mcpManager = await initializeMCPClients(mcpServers)
        mcpTools = mcpManager.tools
      } catch (error) {
        console.error("Failed to initialize MCP clients:", error)
      }
    }

    try {
      // Select the appropriate model based on provider
      let model
      const provider = widget.defaultProvider || "openai"

      switch (provider) {
        case "anthropic":
          model = anthropic("claude-3-5-sonnet-latest")
          break
        case "openai":
        default:
          model = openai("gpt-4o")
          break
      }

      // Prepare system message if provided
      const systemMessage = widget.systemPrompt ? [{ role: "system", content: widget.systemPrompt }] : []

      // Store user message in the database
      const userMessage = messages[messages.length - 1]
      await db.insert(widgetMessages).values({
        conversationId: conversation.id,
        role: userMessage.role,
        content: userMessage.content,
      })

      // Track if the response has completed
      let responseCompleted = false

      // Stream the response
      const result = streamText({
        model,
        messages: [...systemMessage, ...messages],
        // Pass MCP tools directly to streamText
        tools: Object.keys(mcpTools).length > 0 ? mcpTools : undefined,
        maxSteps: 20, // Allow multiple tool invocation steps
        onFinish: async (response) => {
          responseCompleted = true
          
          // Store assistant message in the database
          await db.insert(widgetMessages).values({
            conversationId: conversation.id,
            role: "assistant",
            content: response.text,
          })

          // Clean up MCP clients only after response is complete
          if (mcpManager) {
            try {
              await mcpManager.cleanup()
            } catch (error) {
              console.error("Error cleaning up MCP clients:", error)
            }
          }
        },
        onError: (error) => {
          responseCompleted = true
          console.error("Stream error:", error)
        },
      })

      // Register cleanup for request abort
      request.signal.addEventListener("abort", async () => {
        if (!responseCompleted) {
          console.log("Request aborted, cleaning up resources")
          try {
            if (mcpManager) {
              await mcpManager.cleanup()
            }
          } catch (error) {
            console.error("Error during cleanup on abort:", error)
          }
        }
      })

      // Return the response without consuming the stream
      // This allows the stream to be processed by the client
      return result.toDataStreamResponse({
        sendReasoning: true,
        getErrorMessage: (error) => {
          console.error("Response error:", error)
          return "An error occurred during the conversation."
        }
      })
    } finally {
      // We don't need to clean up MCP clients here
      // as it's handled in onFinish and abort event listener
    }
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
