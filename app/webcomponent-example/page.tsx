"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WebComponentExamplePage() {
  useEffect(() => {
    // Import the web component only on the client side
    import("@/components/mcp-chat-webcomponent");
  }, []);

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Button variant="ghost" asChild className="mb-4 group">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mb-2">Web Component Example</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          This page demonstrates how to use the MCP Chat Widget as a web component
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border rounded-lg p-6 bg-muted/30">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <div className="border rounded-lg p-4 bg-background overflow-x-auto mb-6">
            <pre className="text-sm">
              {`<!-- Include the web component script -->
<script src="/dist/mcp-chat-widget.js"></script>

<!-- Use the web component in your HTML -->
<mcp-chat-widget 
  widget-id="123" 
  name="My Chat Widget"
  description="A customizable chat widget"
  position="bottom-right"
  size="md">
</mcp-chat-widget>`}
            </pre>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Available Attributes</h3>
          <ul className="list-disc list-inside space-y-2 text-sm relative border rounded-lg p-4 bg-background">
            <li><strong>widget-id</strong>: (Optional) The ID of the widget to load from the server</li>
            <li><strong>name</strong>: (Optional) The name of the chat widget</li>
            <li><strong>description</strong>: (Optional) A short description for the chat widget</li>
            <li><strong>system-prompt</strong>: (Optional) Custom system prompt for the AI</li>
            <li><strong>default-provider</strong>: (Optional) Default AI provider</li>
            <li><strong>position</strong>: (Optional) Position of the widget - "bottom-right" or "bottom-left"</li>
            <li><strong>size</strong>: (Optional) Size of the widget - "sm", "md", "lg", "xl", or "full"</li>
            <li><strong>mcp-servers</strong>: (Optional) JSON string of MCP servers configuration</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Live Demo</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            You can see the web component in action to the right.
          </p>
          
            {/* The web component will be rendered here */}
            {/* @ts-ignore - Custom web component */}
            <mcp-chat-widget
              name="Demo Chat Widget"
              description="Web Component Example"
              position="bottom-right"
              widget-id="2"
              size="md"
            />
          </div>
        </div>
      </div>
  );
}
