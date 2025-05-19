import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { widgets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// GET /api/widgets/[id]/embed - Get embed code for a widget
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
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    // Get the base URL for the embed script
    const host = process.env.NEXT_PUBLIC_URL || "http://localhost:3007"
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Create embed codes - both one-line and web component versions
    const oneLineEmbed = `<script src="${baseUrl}/api/widgets/${widgetId}/loader.js" async></script>`

    const webComponentEmbed = `<!-- Include the web component script -->
<script src="${baseUrl}/dist/mcp-chat-widget.js"></script>

<!-- Use the web component in your HTML -->
<mcp-chat-widget 
  widget-id="${widgetId}"
  ${widget.name ? `name="${widget.name}"` : ''}
  ${widget.description ? `description="${widget.description}"` : ''}
  ${widget.position ? `position="${widget.position}"` : ''}
  ${widget.size ? `size="${widget.size}"` : ''}
/>`

    const nextjsEmbed = `"use client"

import Script from "next/script"

export function Widget() {
    return (
        <Script 
            src="${baseUrl}/api/widgets/${widgetId}/loader.js" 
            strategy="afterInteractive"
        />
    )
}
`

// Add a React-specific embed code for Vite/CRA apps
const reactEmbed = `import { useEffect } from 'react';

export function ChatWidget() {
  useEffect(() => {
    // Load the script
    const script = document.createElement('script');
    script.src = "${baseUrl}/dist/mcp-chat-widget.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Create and add the web component after script loads
    script.onload = () => {
      const widget = document.createElement('mcp-chat-widget');
      widget.setAttribute('widget-id', "${widgetId}");
      ${widget.name ? `widget.setAttribute('name', "${widget.name}");` : ''}
      ${widget.description ? `widget.setAttribute('description', "${widget.description}");` : ''}
      ${widget.position ? `widget.setAttribute('position', "${widget.position}");` : ''}
      ${widget.size ? `widget.setAttribute('size', "${widget.size}");` : ''}
      document.body.appendChild(widget);
    };
    
    // Cleanup on unmount
    return () => {
      document.querySelectorAll('mcp-chat-widget').forEach(el => el.remove());
      document.querySelectorAll(\`script[src="${baseUrl}/dist/mcp-chat-widget.js"]\`).forEach(el => el.remove());
    };
  }, []);
  
  return null;
}
`

    // Return both embed codes and widget details
    return NextResponse.json({
      widget,
      embedCodes: {
        oneLine: oneLineEmbed,
        webComponent: webComponentEmbed,
        nextjs: nextjsEmbed,
        react: reactEmbed
      }
    })
  } catch (error) {
    console.error("Failed to get widget embed code:", error)
    return NextResponse.json({ error: "Failed to generate embed code" }, { status: 500 })
  }
}
