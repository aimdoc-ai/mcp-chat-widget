"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import { useChat } from "ai/react"
import { Loader2, Maximize, Eraser, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/expandable-chat"
import { Markdown } from "@/components/markdown"
import { ToolInvocation } from "@/components/tool-invocation"

interface WidgetChatProps {
  widgetId?: number
  initialConfig?: {
    name?: string
    description?: string
    systemPrompt?: string
    defaultProvider?: string
    position?: "bottom-right" | "bottom-left"
    size?: "sm" | "md" | "lg" | "xl" | "full"
    mcpServers?: Array<{
      name: string
      url: string
      type?: string
      isDefault?: boolean
      headers?: Record<string, string>
    }>
  }
}

export function WidgetChat({ widgetId, initialConfig }: WidgetChatProps) {
  type WidgetConfig = {
    position: "bottom-right" | "bottom-left"
    size: "sm" | "md" | "lg" | "xl" | "full"
    name: string
    description: string
    mcpServers: Array<{
      name: string
      url: string
      type?: string
      isDefault?: boolean
      headers?: Record<string, string>
    }>
  }

  const [config, setConfig] = useState<WidgetConfig>({
    position: initialConfig?.position || "bottom-right",
    size: initialConfig?.size || "md",
    name: initialConfig?.name || "Chat Assistant",
    description: initialConfig?.description || "",
    mcpServers: initialConfig?.mcpServers || [],
  })

  const [loading, setLoading] = useState(true)
  const [isMaximized, setIsMaximized] = useState(false)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const originalChatRef = useRef<HTMLDivElement>(null);

  // Create portal container for maximized view
  useEffect(() => {
    if (isMaximized) {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
      overlay.id = 'chat-overlay';
      document.body.appendChild(overlay);
      setPortalContainer(overlay);
      
      // Hide the original chat when maximized
      if (originalChatRef.current) {
        originalChatRef.current.style.display = 'none';
      }
      
      // Cleanup function
      return () => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
          setPortalContainer(null);
        }
        
        // Show the original chat again when maximized view is closed
        if (originalChatRef.current) {
          originalChatRef.current.style.display = '';
        }
      };
    }
  }, [isMaximized]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (portalContainer && e.target === portalContainer) {
        setIsMaximized(false);
      }
    };
    
    if (isMaximized && portalContainer) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMaximized, portalContainer]);

  useEffect(() => {
    async function fetchWidgetConfig() {
      if (!widgetId) {
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/widgets/${widgetId}`)
        if (response.ok) {
          const data = await response.json()
          setConfig({
            position: data.position || config.position,
            size: data.size || config.size,
            name: data.name || config.name,
            description: data.description || config.description,
            mcpServers: data.mcpServers || config.mcpServers,
          })
        }
      } catch (error) {
        console.error("Failed to fetch widget config:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWidgetConfig()
  }, [widgetId])

  const { messages, input, handleInputChange, handleSubmit, isLoading, status, setMessages } = useChat({
    api: widgetId ? `/api/widgets/${widgetId}/chat` : '/api/chat',
    id: widgetId ? `widget-${widgetId}` : 'default-widget',
  })

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
    console.log("Toggling maximize: ", !isMaximized); // Debug logging
  }, [isMaximized]);

  // Function to render both normal and maximized chats with the same components
  const renderChatMessages = useCallback(() => (
    <>
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">Send a message to start the conversation</div>
      ) : (
        messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`text-wrap rounded-lg px-4 py-2 ${
                message.role === "user" ? "max-w-[80%] bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.parts?.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div key={`message-${message.id}-part-${i}`}>
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                  case "tool-invocation":
                    const { toolName, state, args } = part.toolInvocation;
                    // Handle result safely, ensuring it exists before accessing
                    const result = part.toolInvocation && 
                                  'result' in part.toolInvocation ? 
                                  part.toolInvocation.result : 
                                  undefined;
                    
                    return (
                      <ToolInvocation
                        key={`message-${message.id}-part-${i}`}
                        toolName={toolName}
                        state={state}
                        args={args}
                        result={result}
                        isLatestMessage={index === messages.length - 1}
                        status={status}
                      />
                    );
                  default:
                    return null;
                }
              }) || <Markdown>{message.content}</Markdown>}
            </div>
          </div>
        ))
      )}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}
    </>
  ), [messages, isLoading, status]);

  // Render chat input for both normal and maximized views
  const renderChatInput = useCallback(() => (
    <ChatInput
      value={input}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      loading={isLoading}
    >
      <ChatInputTextArea placeholder="Type your message..." />
      <ChatInputSubmit />
    </ChatInput>
  ), [input, handleInputChange, handleSubmit, isLoading]);

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin" /> // Don't render anything while loading
  }

  return (
    <>
      <div ref={originalChatRef}>
        <ExpandableChat position={config.position} size={config.size}>
          <ExpandableChatHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{config.name ?? "Chat Assistant"}</h2>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Clear the chat without reloading the page
                    setMessages([]);
                  }}
                  title="Clear Chat"
                >
                 <Eraser className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMaximize}
                  title="Maximize"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ExpandableChatHeader>

          <ExpandableChatBody className="p-4 space-y-4">
            {renderChatMessages()}
          </ExpandableChatBody>

          <ExpandableChatFooter>
            {renderChatInput()}
          </ExpandableChatFooter>
        </ExpandableChat>
      </div>
      
      {/* Render the maximized chat using portal */}
      {isMaximized && portalContainer && createPortal(
        <div className="relative bg-background border rounded-lg shadow-lg w-[80%] h-[80%] max-w-[800px] max-h-[80vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{config.name ?? "Chat Assistant"}</h2>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleMaximize}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Body */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {renderChatMessages()}
          </div>
          
          {/* Footer */}
          <div className="border-t p-4">
            {renderChatInput()}
          </div>
        </div>,
        portalContainer
      )}
    </>
  )
}
