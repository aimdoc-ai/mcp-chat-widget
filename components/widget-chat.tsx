"use client"

import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin" /> // Don't render anything while loading
  }

  return (
    <ExpandableChat position={config.position} size={config.size}>
      <ExpandableChatHeader>
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">{config.name ?? "Chat Assistant"}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Clear the chat without reloading the page
                // We can't use window.location.reload() as it would minimize the widget
                setMessages([]);
              }}
              title="New Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // First, hide the original chat widget
                const originalChat = document.querySelector('.expandable-chat-container');
                if (originalChat) {
                  (originalChat as HTMLElement).style.display = 'none';
                }
                
                // Add a blur overlay to the page
                const overlay = document.createElement('div');
                overlay.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
                overlay.id = 'chat-overlay';
                
                // Add click event to dismiss when clicking outside
                overlay.addEventListener('click', (e) => {
                  if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    // Show the original chat widget again
                    if (originalChat) {
                      (originalChat as HTMLElement).style.display = '';
                    }
                  }
                });
                
                // Create a close button
                const closeButton = document.createElement('button');
                closeButton.className = 'absolute top-4 right-4 text-white hover:text-gray-300';
                closeButton.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                `;
                closeButton.onclick = () => {
                  document.body.removeChild(overlay);
                  // Show the original chat widget again
                  if (originalChat) {
                    (originalChat as HTMLElement).style.display = '';
                  }
                };
                
                // Create a maximized chat container
                const maxContainer = document.createElement('div');
                maxContainer.className = 'bg-background border rounded-lg shadow-lg overflow-hidden';
                maxContainer.style.position = 'relative';
                maxContainer.style.width = '80%';
                maxContainer.style.height = '80%';
                maxContainer.style.maxWidth = '800px';
                maxContainer.style.maxHeight = '80vh';
                maxContainer.style.display = 'flex';
                maxContainer.style.flexDirection = 'column';
                
                // Create header
                const header = document.createElement('div');
                header.className = 'flex items-center justify-between p-4 border-b';
                header.innerHTML = `
                  <h2 class="text-lg font-semibold">${config.name}</h2>
                `;
                
                // Create body
                const body = document.createElement('div');
                body.className = 'flex-grow overflow-y-auto p-4 space-y-4';
                
                // Copy messages from original chat
                const originalMessages = document.querySelectorAll('.expandable-chat-container .p-4.space-y-4 > div');
                originalMessages.forEach(msg => {
                  body.appendChild(msg.cloneNode(true));
                });
                
                // Create footer with ChatInput
                const footer = document.createElement('div');
                footer.className = 'border-t p-4';
                
                // We'll create a simplified version since we can't easily render React components here
                // This will be styled to look similar to our ChatInput component
                footer.innerHTML = `
                  <div class="flex flex-col items-end w-full p-2 rounded-2xl border border-input bg-transparent">
                    <textarea class="w-full max-h-[400px] min-h-0 resize-none overflow-x-hidden border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none" placeholder="Type your message..."></textarea>
                    <button class="shrink-0 rounded-full p-1.5 h-fit border dark:border-zinc-600 bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m5 12 7-7 7 7"></path>
                        <path d="M12 19V5"></path>
                      </svg>
                    </button>
                  </div>
                `;
                
                // Add components to container
                maxContainer.appendChild(header);
                maxContainer.appendChild(body);
                maxContainer.appendChild(footer);
                
                // Add the close button and container to the overlay
                overlay.appendChild(closeButton);
                overlay.appendChild(maxContainer);
                
                // Add the overlay to the body
                document.body.appendChild(overlay);
                
                // Add event listeners for the textarea and button
                const textareaElement = maxContainer.querySelector('textarea') as HTMLTextAreaElement;
                const submitButton = maxContainer.querySelector('button') as HTMLButtonElement;
                
                if (textareaElement && submitButton) {
                  // Set initial value from the original chat input
                  textareaElement.value = input;
                  
                  // Handle submit button click
                  submitButton.addEventListener('click', () => {
                    if (textareaElement.value.trim()) {
                      // Update the input value in the original chat
                      handleInputChange({ target: { value: textareaElement.value } } as any);
                      
                      // Close the overlay
                      document.body.removeChild(overlay);
                      
                      // Show the original chat widget again
                      const originalChat = document.querySelector('.expandable-chat-container');
                      if (originalChat) {
                        (originalChat as HTMLElement).style.display = '';
                      }
                      
                      // Submit the form
                      handleSubmit(new Event('submit') as any);
                    }
                  });
                  
                  // Handle Enter key in textarea
                  textareaElement.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (textareaElement.value.trim()) {
                        submitButton.click();
                      }
                    }
                  });
                }
              }}
              title="Maximize"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </Button>
          </div>
        </div>
      </ExpandableChatHeader>

      <ExpandableChatBody className="p-4 space-y-4">
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
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={isLoading}
        >
          <ChatInputTextArea placeholder="Type your message..." />
          <ChatInputSubmit />
        </ChatInput>
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}
