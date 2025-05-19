import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { widgets, widgetConversations, widgetMessages } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"

// GET /api/widgets/[id]/conversations/[conversationId]/messages - Get all messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; conversationId: string }> }
) {
  try {
    const unwrappedParams = await params
    const widgetId = Number.parseInt(unwrappedParams.id)
    const conversationId = Number.parseInt(unwrappedParams.conversationId)

    // Verify the widget exists
    const widget = await db.query.widgets.findFirst({
      where: eq(widgets.id, widgetId),
    })

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    // Verify the conversation exists and belongs to the widget
    const conversation = await db.query.widgetConversations.findFirst({
      where: and(
        eq(widgetConversations.id, conversationId),
        eq(widgetConversations.widgetId, widgetId)
      ),
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Get the messages
    const messages = await db.query.widgetMessages.findMany({
      where: eq(widgetMessages.conversationId, conversationId),
      orderBy: [asc(widgetMessages.createdAt)],
    })

    // Format messages for chat display
    const formattedMessages = messages.map(message => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error("Failed to get messages:", error)
    return NextResponse.json({ error: "Failed to get messages" }, { status: 500 })
  }
}

// POST /api/widgets/[id]/conversations/[conversationId]/messages - Add a message to a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; conversationId: string }> }
) {
  try {
    const unwrappedParams = await params
    const widgetId = Number.parseInt(unwrappedParams.id)
    const conversationId = Number.parseInt(unwrappedParams.conversationId)
    const { role, content } = await request.json()

    // Verify the conversation exists and belongs to the widget
    const conversation = await db.query.widgetConversations.findFirst({
      where: and(
        eq(widgetConversations.id, conversationId),
        eq(widgetConversations.widgetId, widgetId)
      ),
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Create the message
    const [message] = await db
      .insert(widgetMessages)
      .values({
        conversationId,
        role,
        content,
      })
      .returning()

    // Update the conversation's updatedAt timestamp
    await db
      .update(widgetConversations)
      .set({ updatedAt: new Date() })
      .where(eq(widgetConversations.id, conversationId))

    return NextResponse.json(message)
  } catch (error) {
    console.error("Failed to create message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}