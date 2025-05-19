"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Code } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { BasicSettings } from "./basic-settings"
import { AppearanceSettings } from "./appearance-settings"
import { ModelSettings } from "./model-settings"
import { MCPSettings } from "./mcp-settings"
import { WidgetPreview } from "./widget-preview"
import { HeaderBuilder } from "./header-builder"
import { AIIndicator } from "../indicator"

interface WidgetSettings {
  // Basic settings
  projectName: string
  chatDescription: string
  systemPrompt: string

  // Appearance settings
  minimizeIcon: string
  widgetSize: string
  widgetPosition: string

  // Model settings
  modelProvider: string
  model: string

  // MCP settings
  mcpEnabled: boolean
  mcpServers: Array<{
    name: string
    transportType: string
    url: string
  }>
}

interface ChatWidgetBuilderProps {
  widgetId: string
}

export default function ChatWidgetBuilder({ widgetId }: ChatWidgetBuilderProps) {
  const router = useRouter()
  const isNew = widgetId === "new"
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<WidgetSettings>({
    // Basic settings
    projectName: "My Chat Widget",
    chatDescription: "Ask me anything about our products and services",
    systemPrompt: "You are a helpful assistant that answers questions about our products and services.",

    // Appearance settings
    minimizeIcon: "message-circle",
    widgetSize: "medium",
    widgetPosition: "bottom-right",

    // Model settings
    modelProvider: "openai",
    model: "gpt-4o",

    // MCP settings
    mcpEnabled: false,
    mcpServers: [],
  })

  const handleSettingsChange = (newSettings: Partial<WidgetSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const handleAddMCPServer = (server: { name: string; transportType: string; url: string }) => {
    setSettings((prev) => ({
      ...prev,
      mcpServers: [...prev.mcpServers, server],
    }))
  }

  const handleRemoveMCPServer = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      mcpServers: prev.mcpServers.filter((_, i) => i !== index),
    }))
  }

  // Fetch widget data when editing an existing widget
  useEffect(() => {
    if (!isNew) {
      fetchWidget(widgetId)
    }
  }, [isNew, widgetId])

  // Function to fetch widget data
  async function fetchWidget(id: string) {
    try {
      const response = await fetch(`/api/widgets/${id}`)
      if (response.ok) {
        const data = await response.json()
        
        // Map API data to our settings structure
        setSettings({
          projectName: data.name,
          chatDescription: data.description || "",
          systemPrompt: data.systemPrompt || "",
          
          minimizeIcon: "message-circle", // Default value as this might not be in the API
          widgetSize: mapWidgetSize(data.size),
          widgetPosition: data.position || "bottom-right",
          
          modelProvider: data.defaultProvider || "openai",
          model: mapModelName(data.defaultProvider, data.model),
          
          mcpEnabled: data.mcpServers && data.mcpServers.length > 0,
          mcpServers: data.mcpServers ? data.mcpServers.map((server: any) => ({
            name: server.name,
            transportType: server.type || "sse",
            url: server.url
          })) : []
        })
      } else {
        console.error("Failed to fetch widget")
        toast.error("Failed to load widget", {
          description: "The widget could not be found or loaded. Redirecting to dashboard.",
          duration: 3000,
        });
        router.push("/admin")
      }
    } catch (error) {
      console.error("Failed to fetch widget:", error)
      toast.error("Failed to load widget", {
        description: "An unexpected error occurred while loading the widget. Redirecting to dashboard.",
        duration: 3000,
      });
      router.push("/admin")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to map widget size
  function mapWidgetSize(size: string | undefined): string {
    switch (size) {
      case "sm": return "small"
      case "md": return "medium"
      case "lg": return "large"
      case "xl": return "large" // Map xl to large for now
      case "full": return "large" // Map full to large for now
      default: return "medium"
    }
  }

  // Helper function to map model name
  function mapModelName(provider: string | undefined, model: string | undefined): string {
    if (provider === "anthropic") {
      return model || "claude-3-opus"
    }
    return model || "gpt-4o"
  }

  // Function to save widget
  async function handleSave() {
    setSaving(true)

    try {
      // Map our settings structure back to API structure
      const widgetData = {
        name: settings.projectName,
        description: settings.chatDescription,
        systemPrompt: settings.systemPrompt,
        defaultProvider: settings.modelProvider,
        position: settings.widgetPosition,
        size: mapSizeToAPI(settings.widgetSize),
        model: settings.model,
        mcpServers: settings.mcpEnabled ? settings.mcpServers.map(server => ({
          name: server.name,
          type: server.transportType,
          url: server.url,
          isDefault: true // Make the first one default for now
        })) : []
      }

      const url = isNew ? "/api/widgets" : `/api/widgets/${widgetId}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(widgetData),
      })

      if (response.ok) {
        // Show success toast notification
        toast.success(isNew ? "Widget created successfully!" : "Widget updated successfully!", {
          description: `${settings.projectName} has been ${isNew ? 'created' : 'updated'}.`,
          duration: 3000,
        });
        
        // Redirect to admin page
        router.push("/admin")
      } else {
        const error = await response.json()
        // Show error toast notification
        toast.error("Failed to save widget", {
          description: error.error || "An unknown error occurred",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Failed to save widget:", error)
      // Show error toast notification
      toast.error("Failed to save widget", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setSaving(false)
    }
  }

  // Helper function to map widget size to API format
  function mapSizeToAPI(size: string): string {
    switch (size) {
      case "small": return "sm"
      case "medium": return "md"
      case "large": return "lg"
      default: return "md"
    }
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
        <div className="mx-auto max-w-7xl py-24 flex justify-center">
          <AIIndicator loading={true} />
        </div>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 px-6 max-w-7xl mx-auto">
        <div className="w-full">
          <div className="flex items-center mb-4">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{isNew ? "Create Widget" : "Edit Widget"}</h1>
            
            <div className="ml-auto flex gap-2">
              {!isNew && (
                <Button variant="outline" asChild className="flex items-center">
                  <Link href={`/admin/widgets/${widgetId}/embed`}>
                    <Code className="mr-2 h-4 w-4" />
                    Embed
                  </Link>
                </Button>
              )}
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Widget
                  </>
                )}
              </Button>
            </div>
          </div>
          <HeaderBuilder isNew={isNew} />
        </div>
      </div>
      <div className="mt-4 flex flex-col md:flex-row gap-6 px-6 max-w-7xl mx-auto">
        {/* Configuration Panel */}
        <div className="w-full md:w-1/2 space-y-6">
        <BasicSettings settings={settings} onSettingsChange={handleSettingsChange} />

        <AppearanceSettings settings={settings} onSettingsChange={handleSettingsChange} />

        <ModelSettings settings={settings} onSettingsChange={handleSettingsChange} />

        <MCPSettings
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onAddServer={handleAddMCPServer}
          onRemoveServer={handleRemoveMCPServer}
        />
      </div>

      {/* Preview Panel */}
      <div className="w-full md:w-1/2 sticky top-6 h-full">
          <WidgetPreview settings={settings} />
        </div>
      </div>
    </>
  )
}
