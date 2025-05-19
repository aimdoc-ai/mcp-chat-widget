"use client";

import React from "react";
import r2wc from "@r2wc/react-to-web-component";
import { WidgetChat } from "./widget-chat";

// Import global styles needed for the component
import '../app/globals.css';

// This component will serve as a wrapper for the WidgetChat component
// It will handle converting attributes to props
const WebComponentWrapper = (props: any) => {
  // Convert kebab-case attributes to camelCase props
  const widgetId = props.widgetId ? Number(props.widgetId) : undefined;
  
  // Parse initialConfig from attributes if provided
  const initialConfig: any = {
    name: props.name,
    description: props.description,
    systemPrompt: props.systemPrompt,
    defaultProvider: props.defaultProvider,
    position: props.position as "bottom-right" | "bottom-left" | undefined,
    size: props.size as "sm" | "md" | "lg" | "xl" | "full" | undefined,
    mcpServers: props.mcpServers ? JSON.parse(props.mcpServers) : undefined,
  };

  // Only pass initialConfig if at least one property is defined
  const hasConfig = Object.values(initialConfig).some(value => value !== undefined);
  
  return (
    <WidgetChat 
      widgetId={widgetId} 
      initialConfig={hasConfig ? initialConfig : undefined} 
    />
  );
};

// Create the base web component 
const BaseWebComponent = r2wc(WebComponentWrapper, { 
  props: {
    widgetId: "number",
    name: "string",
    description: "string",
    systemPrompt: "string",
    defaultProvider: "string",
    position: "string",
    size: "string",
    mcpServers: "json"
  },
  shadow: "open" // Explicitly enable shadow DOM
});

// Create a custom class that extends the web component to inject styles
class StyledMcpChatWidget extends BaseWebComponent {
  // Use the connected callback to inject styles
  // @ts-ignore
  connectedCallback() {
    // @ts-ignore
    if (super.connectedCallback) {
      // @ts-ignore
      super.connectedCallback();
    }
    
    // Inject Tailwind styles into shadow DOM
    if (this.shadowRoot) {
      // Create a style element
      const styleElement = document.createElement('style');
      
      // Get styles from window object (set in the entry point file)
      // If window.__tailwindStyles exists (from our entry point), use that
      // Otherwise try to get styles directly from the document
      if ((window as any).__tailwindStyles) {
        styleElement.textContent = (window as any).__tailwindStyles;
      } else {
        // Fallback: try to get Tailwind styles from the document
        const tailwindStyles = document.querySelector('style[data-tailwind]');
        if (tailwindStyles) {
          styleElement.textContent = tailwindStyles.textContent || '';
        } else {
          // Last resort: collect all styles from the document
          const allStyles = document.querySelectorAll('style');
          let combinedStyles = '';
          allStyles.forEach(style => {
            combinedStyles += style.textContent || '';
          });
          styleElement.textContent = combinedStyles;
        }
      }
      
      // Append styles to shadow root
      this.shadowRoot.appendChild(styleElement);
    }
  }
}

// Register the custom element with the browser
// This will only run in the browser environment
if (typeof window !== "undefined") {
  if (!customElements.get("mcp-chat-widget")) {
    customElements.define("mcp-chat-widget", StyledMcpChatWidget);
  }
}

export default StyledMcpChatWidget;
