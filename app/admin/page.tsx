"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Trash2, Server, Bot } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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
        }
      } catch (error) {
        console.error("Failed to fetch widgets:", error)
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

    try {
      const response = await fetch(`/api/widgets/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWidgets(widgets.filter((widget) => widget.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete widget:", error)
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
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {widgets.map((widget) => (
            <Card key={widget.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <span className="text-lg line-clamp-1">{widget.name}</span>
                  <Badge variant="outline" className={`ml-2 ${getProviderBadgeColor(widget.defaultProvider)}`}>
                    {widget.defaultProvider === 'openai' ? 'OpenAI' : 'Anthropic'}
                  </Badge>
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
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
                <Button variant="destructive" size="sm" onClick={() => deleteWidget(widget.id)}>
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
