"use client";

import React from "react";
import * as ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import { WidgetChat } from "./widget-chat";

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

// Convert the React component to a web component
const WebComponent = reactToWebComponent(WebComponentWrapper, React, ReactDOM);

// Register the custom element with the browser
// This will only run in the browser environment
if (typeof window !== "undefined") {
  if (!customElements.get("mcp-chat-widget")) {
    customElements.define("mcp-chat-widget", WebComponent as any);
  }
}

export default WebComponent;
