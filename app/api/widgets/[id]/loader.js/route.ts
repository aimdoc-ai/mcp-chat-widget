import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { widgets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// GET /api/widgets/[id]/loader.js - Get widget loader script
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unwrappedParams = await params
    const widgetId = Number.parseInt(unwrappedParams.id)

    // Verify the widget exists
    const widget = await db.query.widgets.findFirst({
      where: eq(widgets.id, widgetId),
    })

    if (!widget) {
      return new Response("console.error('MCP Chat Widget: Widget not found');", {
        status: 404,
        headers: { "Content-Type": "application/javascript" }
      })
    }

    // Get the base URL for the script resource
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://mcpwrapper.app"


    // Create a JavaScript loader that automatically injects and initializes the widget
    const loaderScript = `
(function() {
  // Load the web component script
  function loadWebComponent() {
    if (document.querySelector('script[src="${baseUrl}/dist/mcp-chat-widget.js"]')) {
      initializeWidget();
      return;
    }
    
    const script = document.createElement('script');
    script.src = "${baseUrl}/dist/mcp-chat-widget.js";
    script.onload = initializeWidget;
    document.head.appendChild(script);
  }
  
  // Initialize the widget after the script has loaded
  function initializeWidget() {
    // Check if the widget is already defined
    if (customElements.get('mcp-chat-widget')) {
      if (!document.querySelector('mcp-chat-widget[widget-id="${widgetId}"]')) {
        const chatWidget = document.createElement('mcp-chat-widget');
        chatWidget.setAttribute('widget-id', '${widgetId}');
        ${widget.name ? `chatWidget.setAttribute('name', '${widget.name.replace(/'/g, "\\'")}');` : ''}
        ${widget.description ? `chatWidget.setAttribute('description', '${widget.description.replace(/'/g, "\\'")}');` : ''}
        ${widget.position ? `chatWidget.setAttribute('position', '${widget.position}');` : ''}
        ${widget.size ? `chatWidget.setAttribute('size', '${widget.size}');` : ''}
        document.body.appendChild(chatWidget);
      }
    } else {
      // If custom element is not defined yet, try again in 100ms
      setTimeout(initializeWidget, 100);
    }
  }
  
  // Run on DOM content loaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWebComponent);
  } else {
    loadWebComponent();
  }
})();
`

    // Return the JavaScript loader
    return new Response(loaderScript, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600"
      }
    })
  } catch (error) {
    console.error("Failed to generate loader script:", error)
    return new Response("console.error('MCP Chat Widget: Failed to load widget loader');", {
      status: 500,
      headers: { "Content-Type": "application/javascript" }
    })
  }
} 