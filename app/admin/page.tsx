"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Trash2, Server, Bot, Copy } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Loading from "@/components/loading"

interface Widget {
  id: number
  name: string
  description: string | null
  defaultProvider: string
  mcpServers: any[]
}

export default function AdminPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()  

  useEffect(() => {
    async function fetchWidgets() {
      try {
        const response = await fetch("/api/widgets")
        if (response.ok) {
          const data = await response.json()
          setWidgets(data)
        } else {
          toast.error("Failed to load widgets", {
            description: "There was a problem loading your widgets. Please try refreshing the page.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch widgets:", error)
        toast.error("Failed to load widgets", {
          description: "An unexpected error occurred while loading your widgets. Please try refreshing the page.",
          duration: 5000,
        });
      } finally {
        setLoading(false)
      }
    }

    fetchWidgets()
  }, [])

  async function deleteWidget(id: number) {
    if (!confirm("Are you sure you want to delete this widget?")) {
      return
    }

    // Find the widget to get its name for the toast message
    const widgetToDelete = widgets.find(widget => widget.id === id);
    const widgetName = widgetToDelete?.name || "Widget";

    try {
      const response = await fetch(`/api/widgets/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Show success toast notification
        toast.success("Widget deleted", {
          description: `${widgetName} has been successfully deleted.`,
          duration: 3000,
        });
        
        // Update the UI by removing the deleted widget
        setWidgets(widgets.filter((widget) => widget.id !== id))
      } else {
        // Show error toast notification
        toast.error("Failed to delete widget", {
          description: "An error occurred while trying to delete the widget.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Failed to delete widget:", error)
      // Show error toast notification
      toast.error("Failed to delete widget", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    }
  }

  function getProviderBadgeColor(provider: string) {
    return provider === 'openai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <h1 className="text-2xl font-bold">Chat Widgets</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your AI chat widgets and their configurations</p>
        </div>
        <Button asChild>
          <Link href="/admin/widgets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Widget
          </Link>
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : widgets.length === 0 ? (
        <Card className="border-dashed max-w-xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No widgets found</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Create your first chat widget to start providing AI assistance on your website
            </p>
            <Button asChild>
              <Link href="/admin/widgets/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Widget
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {widgets.map((widget) => (
            <Card key={widget.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg line-clamp-1">{widget.name}</span>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(widget.id.toString());
                    toast.success("Widget ID copied to clipboard");
                  }}>
                      <Copy className="mr-2 h-3.5 w-3.5" />
                       id: {widget.id}
                  </Button>
                </CardTitle>
                <CardDescription className="flex flex-col line-clamp-2 min-h-[40px]">
                  <Badge variant="outline" className={`mr-2 ${getProviderBadgeColor(widget.defaultProvider)}`}>
                      {widget.defaultProvider === 'openai' ? 'OpenAI' : 'Anthropic'}
                  </Badge>
                  {widget.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Server className="h-4 w-4 mr-1" />
                  <span>
                    {widget.mcpServers.length} {widget.mcpServers.length === 1 ? 'MCP Server' : 'MCP Servers'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-muted/50 pt-3 pb-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/widgets/${widget.id}`}>
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/widgets/${widget.id}/embed`}>
                      <Copy className="mr-2 h-3.5 w-3.5" />
                      Embed
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteWidget(widget.id)}>
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
