"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';

// Import Script component only on client-side to avoid SSR issues
const Script = dynamic(() => import('next/script'), { ssr: false });

export default function WebComponentExamplePage() {
  const demoAreaRef = useRef<HTMLDivElement>(null);

  const handleScriptLoad = () => {
    // Create and add the chat widget to the demo area after script is loaded
    if (demoAreaRef.current && typeof window !== 'undefined') {
      // Check if a widget already exists to prevent duplicates
      if (!demoAreaRef.current.querySelector('mcp-chat-widget')) {
        // Create web component 
        const chatWidget = document.createElement('mcp-chat-widget');
        chatWidget.setAttribute('name', 'Demo Chat Widget');
        chatWidget.setAttribute('description', 'Web Component Example');
        chatWidget.setAttribute('position', 'bottom-right');
        chatWidget.setAttribute('size', 'md');
        chatWidget.setAttribute('widget-id', '2');
        
        // Add to the demo area
        demoAreaRef.current.appendChild(chatWidget);
      }
    }
  };

  // Also add a useEffect as fallback for script loading
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || !demoAreaRef.current) {
      return;
    }

    // Check if web component is already defined
    if (customElements.get('mcp-chat-widget')) {
      handleScriptLoad();
    } else {
      // Load script dynamically if not loaded by Script component
      const scriptEl = document.querySelector('script[src="/dist/mcp-chat-widget.js"]');
      if (!scriptEl) {
        const script = document.createElement('script');
        script.src = '/dist/mcp-chat-widget.js';
        script.onload = handleScriptLoad;
        document.head.appendChild(script);
      }
    }
  }, []);

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      {/* Load the web component script using Next.js Script component */}
      <Script 
        src="/dist/mcp-chat-widget.js" 
        strategy="afterInteractive" 
        onLoad={handleScriptLoad}
      />

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
            You can see the web component in action below.
          </p>
          
          {/* Demo area where the web component will be rendered */}
          <div className="demo-area h-64 border rounded-lg relative bg-background" ref={demoAreaRef}>
            {/* The chat widget will be added here by the script onLoad callback */}
          </div>
        </div>
      </div>
    </div>
  );
}
