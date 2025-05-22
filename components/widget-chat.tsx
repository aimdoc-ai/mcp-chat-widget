"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { useChat } from "ai/react"
import { Loader2, Maximize, X, PlusCircle, History, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInput, ChatInputTextArea, ChatInputSubmit, ChatInputMic } from "@/components/chat-input"
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

interface Conversation {
  id: number
  sessionId: string
  createdAt: string
  updatedAt: string
  preview: string
}

interface Message {
  id: number
  role: string
  content: string
  createdAt: string
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
  
  // Chat history state
  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [loadingConversation, setLoadingConversation] = useState(false)

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
    api: widgetId ? `${process.env.NEXT_PUBLIC_URL}/api/widgets/${widgetId}/chat` : `https://mcpwrapper.app/api/chat`,
    id: widgetId ? `widget-${widgetId}` : 'default-widget',
  })

  // Fetch conversations when history is opened
  useEffect(() => {
    if (showHistory && widgetId) {
      fetchConversations()
    }
  }, [showHistory, widgetId])

  // Function to fetch chat history conversations
  const fetchConversations = async () => {
    if (!widgetId) return
    
    try {
      const response = await fetch(`/api/widgets/${widgetId}/conversations`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    }
  }

  // Function to load a conversation
  const loadConversation = async (conversationId: number) => {
    if (!widgetId) return
    
    setLoadingConversation(true)
    
    try {
      const response = await fetch(`/api/widgets/${widgetId}/conversations/${conversationId}/messages`)
      if (response.ok) {
        const messages = await response.json()
        
        // Convert to the format expected by useChat
        const formattedMessages = messages.map((message: Message) => ({
          id: message.id.toString(),
          role: message.role,
          content: message.content,
        }))
        
        setMessages(formattedMessages)
        setSelectedConversation(conversationId)
        setShowHistory(false)
      }
    } catch (error) {
      console.error("Failed to load conversation:", error)
    } finally {
      setLoadingConversation(false)
    }
  }

  // Function to delete a conversation
  const deleteConversation = async (conversationId: number) => {
    if (!widgetId) return
    
    try {
      const response = await fetch(`/api/widgets/${widgetId}/conversations/${conversationId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh the conversation list
        fetchConversations()
        
        // If the deleted conversation was selected, clear the messages
        if (selectedConversation === conversationId) {
          setMessages([])
          setSelectedConversation(null)
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error)
    }
  }

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
    console.log("Toggling maximize: ", !isMaximized); // Debug logging
  }, [isMaximized]);

  // Function to create a new chat
  const startNewChat = () => {
    setMessages([])
    setSelectedConversation(null)
    setShowHistory(false)
  }

  // Function to toggle history view
  const toggleHistory = () => {
    setShowHistory(prev => !prev)
  }

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

  // Render chat history
  const renderChatHistory = useCallback(() => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={toggleHistory}
          title="Back to Chat"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Chat
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No chat history found</div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                className="p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => loadConversation(conversation.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.updatedAt).toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conversation.id)
                    }}
                    title="Delete conversation"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm truncate">{conversation.preview}</p>
              </div>
            ))}
          </div>
        )}
        {loadingConversation && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  ), [conversations, loadingConversation]);

  // Render chat input for both normal and maximized views
  const renderChatInput = useCallback(() => (
    <ChatInput
      value={input}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      loading={isLoading}
      setInputValue={(value) => handleInputChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>)}
    >
      <div className="flex w-full items-end gap-2">
        <ChatInputTextArea 
          placeholder="Type your message..." 
          className="flex-grow" 
        />
        <div className="flex gap-2">
          <ChatInputMic />
          <ChatInputSubmit />
        </div>
      </div>
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
                  onClick={toggleHistory}
                  title="Chat History"
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startNewChat}
                  title="New Chat"
                >
                 <PlusCircle className="h-4 w-4" />
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
            {showHistory ? renderChatHistory() : renderChatMessages()}
          </ExpandableChatBody>

          <ExpandableChatFooter>
            {!showHistory && renderChatInput()}
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
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleHistory}
                title="Chat History"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={startNewChat}
                title="New Chat"
              >
               <PlusCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" 
                size="icon"
                onClick={toggleMaximize}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Body */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {showHistory ? renderChatHistory() : renderChatMessages()}
          </div>
          
          {/* Footer */}
          <div className="border-t p-4">
            {!showHistory && renderChatInput()}
          </div>
        </div>,
        portalContainer
      )}
    </>
  )
}
