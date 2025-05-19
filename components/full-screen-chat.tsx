"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useChat } from "ai/react"
import { Loader2, PlusCircle, History, ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/chat-input"
import { Markdown } from "@/components/markdown"
import { ToolInvocation } from "@/components/tool-invocation"
import { AIIndicator } from "./indicator"

interface FullScreenChatProps {
  widgetId?: number
  initialConfig?: {
    name?: string
    description?: string
    systemPrompt?: string
    defaultProvider?: string
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

export function FullScreenChat({ widgetId, initialConfig }: FullScreenChatProps) {
  type ChatConfig = {
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

  const [config, setConfig] = useState<ChatConfig>({
    name: initialConfig?.name || "Chat Assistant",
    description: initialConfig?.description || "",
    mcpServers: initialConfig?.mcpServers || [],
  })

  const [loading, setLoading] = useState(true)
  
  // Chat history state
  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [loadingConversation, setLoadingConversation] = useState(false)

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

  // Function to render chat messages
  const renderChatMessages = useCallback(() => (
    <div className="flex flex-col space-y-1 w-full">
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">Send a message to start the conversation</div>
      ) : (
        messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start w-full"}`}>
            <div
              className={`text-wrap rounded-lg px-4 py-2 my-2 ${
                message.role === "user" ? "max-w-[70%] bg-primary text-primary-foreground" : "w-full bg-muted"
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
        <div className="flex justify-start w-full">
          <AIIndicator loading={true} />
        </div>
      )}
    </div>
  ), [messages, isLoading, status]);

  // Render chat history
  const renderChatHistory = useCallback(() => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={toggleHistory}
          title="Back to Chat"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Chat
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto">
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
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  ), [conversations, loadingConversation]);

  // Render chat input
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
    return <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <div className="flex flex-col h-full w-full bg-background border rounded-lg shadow-sm overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-none border-b bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{config.name}</h2>
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
          </div>
        </div>
      </div>
      
      {/* Messages - Scrollable */}
      <div className="flex-grow overflow-y-auto p-8">
        {showHistory ? renderChatHistory() : renderChatMessages()}
      </div>
      
      {/* Footer - Fixed */}
      <div className="flex-none border-t bg-background p-4">
        {!showHistory && renderChatInput()}
      </div>
    </div>
  )
} 