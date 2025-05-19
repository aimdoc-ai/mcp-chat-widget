import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { widgets, widgetConversations, widgetMessages } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

// GET /api/widgets/[id]/conversations - Get all conversations for a widget
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params
    const widgetId = Number.parseInt(unwrappedParams.id)

    // Verify the widget exists
    const widget = await db.query.widgets.findFirst({
      where: eq(widgets.id, widgetId),
    })

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    // Get the conversations
    const conversations = await db.query.widgetConversations.findMany({
      where: eq(widgetConversations.widgetId, widgetId),
      orderBy: [desc(widgetConversations.updatedAt)],
      with: {
        messages: {
          limit: 1,
          orderBy: [desc(widgetMessages.createdAt)],
        },
      },
    })

    // Format the response
    const formattedConversations = conversations.map(conversation => {
      const lastMessage = conversation.messages[0]?.content || ""
      return {
        id: conversation.id,
        sessionId: conversation.sessionId,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        preview: lastMessage.substring(0, 100) + (lastMessage.length > 100 ? "..." : ""),
      }
    })

    return NextResponse.json(formattedConversations)
  } catch (error) {
    console.error("Failed to get conversations:", error)
    return NextResponse.json({ error: "Failed to get conversations" }, { status: 500 })
  }
}

// POST /api/widgets/[id]/conversations - Create a new conversation
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params
    const widgetId = Number.parseInt(unwrappedParams.id)
    const { sessionId } = await request.json()

    // Verify the widget exists
    const widget = await db.query.widgets.findFirst({
      where: eq(widgets.id, widgetId),
    })

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    // Create a new conversation
    const [conversation] = await db
      .insert(widgetConversations)
      .values({
        widgetId,
        sessionId,
      })
      .returning()

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Failed to create conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}