import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { widgets, widgetMcpServers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// GET /api/widgets/[id] - Get a specific widget
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const id = Number.parseInt(unwrappedParams.id)

    const widget = await db.query.widgets.findFirst({
      where: eq(widgets.id, id),
      with: {
        mcpServers: true,
      },
    })

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    return NextResponse.json(widget)
  } catch (error) {
    console.error("Failed to get widget:", error)
    return NextResponse.json({ error: "Failed to get widget" }, { status: 500 })
  }
}

// PUT /api/widgets/[id] - Update a widget
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const id = Number.parseInt(unwrappedParams.id)
    const body = await request.json()

    // Extract widget data and MCP servers
    const { mcpServers, ...widgetData } = body

    // Update the widget
    await db
      .update(widgets)
      .set({ ...widgetData, updatedAt: new Date() })
      .where(eq(widgets.id, id))

    // Handle MCP servers if provided
    if (mcpServers && Array.isArray(mcpServers)) {
      // Delete existing MCP servers
      await db.delete(widgetMcpServers).where(eq(widgetMcpServers.widgetId, id))

    // Add new MCP servers
    if (mcpServers.length > 0) {
      await db.insert(widgetMcpServers).values(
        mcpServers.map((server: any) => {
          // Extract only the fields we need, excluding any date fields
          const { id: serverId, createdAt, updatedAt, ...serverData } = server;
          return {
            ...serverData,
            widgetId: id,
            // Set the dates explicitly
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
      )
    }
    }

    // Get the updated widget
    const updatedWidget = await db.query.widgets.findFirst({
      where: eq(widgets.id, id),
      with: {
        mcpServers: true,
      },
    })

    return NextResponse.json(updatedWidget)
  } catch (error) {
    console.error("Failed to update widget:", error)
    return NextResponse.json({ error: "Failed to update widget" }, { status: 500 })
  }
}

// DELETE /api/widgets/[id] - Delete a widget
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const id = Number.parseInt(unwrappedParams.id)

    // Delete the widget (cascade will handle related records)
    await db.delete(widgets).where(eq(widgets.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete widget:", error)
    return NextResponse.json({ error: "Failed to delete widget" }, { status: 500 })
  }
}
