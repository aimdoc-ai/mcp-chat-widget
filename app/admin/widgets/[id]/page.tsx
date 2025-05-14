"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface WidgetFormProps {
  params: Promise<{
    id: string
  }>
}

export default function WidgetForm({ params }: WidgetFormProps) {
  const unwrappedParams = React.use(params) as { id: string }
  const isNew = unwrappedParams.id === "new"
  const router = useRouter()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const [widget, setWidget] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    defaultProvider: "openai",
    position: "bottom-right",
    size: "md",
  })

  const [mcpServers, setMcpServers] = useState<any[]>([])

  useEffect(() => {
    if (!isNew) {
      fetchWidget(unwrappedParams.id)
    }
  }, [isNew, unwrappedParams.id])

  async function fetchWidget(id: string) {
    try {
      const response = await fetch(`/api/widgets/${id}`)
      if (response.ok) {
        const data = await response.json()
        setWidget({
          name: data.name,
          description: data.description || "",
          systemPrompt: data.systemPrompt || "",
          defaultProvider: data.defaultProvider,
          position: data.position,
          size: data.size,
        })
        setMcpServers(data.mcpServers || [])
      } else {
        router.push("/admin")
      }
    } catch (error) {
      console.error("Failed to fetch widget:", error)
      router.push("/admin")
    } finally {
      setLoading(false)
    }
  }

  function handleWidgetChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setWidget((prev) => ({ ...prev, [name]: value }))
  }

  function handleSelectChange(name: string, value: string) {
    setWidget((prev) => ({ ...prev, [name]: value }))
  }

  function addMcpServer() {
    setMcpServers((prev) => [
      ...prev,
      {
        name: "",
        url: "",
        type: "sse",
        isDefault: prev.length === 0,
        headers: {},
      },
    ])
  }

  function removeMcpServer(index: number) {
    setMcpServers((prev) => {
      const newServers = [...prev]
      newServers.splice(index, 1)

      // If we removed the default server and there are still servers left,
      // make the first one the default
      if (prev[index].isDefault && newServers.length > 0) {
        newServers[0].isDefault = true
      }

      return newServers
    })
  }

  function handleMcpServerChange(index: number, field: string, value: any) {
    setMcpServers((prev) => {
      const newServers = [...prev]
      newServers[index] = { ...newServers[index], [field]: value }

      // If setting this server as default, unset others
      if (field === "isDefault" && value === true) {
        newServers.forEach((server, i) => {
          if (i !== index) {
            server.isDefault = false
          }
        })
      }

      return newServers
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNew ? "/api/widgets" : `/api/widgets/${unwrappedParams.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...widget,
          mcpServers,
        }),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        const error = await response.json()
        alert(`Failed to save: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to save widget:", error)
      alert("Failed to save widget")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? "Create Widget" : "Edit Widget"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Widget Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={widget.name} onChange={handleWidgetChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultProvider">Default Provider</Label>
                <Select
                  value={widget.defaultProvider}
                  onValueChange={(value) => handleSelectChange("defaultProvider", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude 3.5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select value={widget.position} onValueChange={(value) => handleSelectChange("position", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select value={widget.size} onValueChange={(value) => handleSelectChange("size", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                    <SelectItem value="full">Full Screen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={widget.description}
                onChange={handleWidgetChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                name="systemPrompt"
                value={widget.systemPrompt}
                onChange={handleWidgetChange}
                rows={4}
                placeholder="You are a helpful assistant..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>MCP Servers</CardTitle>
            <Button type="button" variant="outline" onClick={addMcpServer}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Server
            </Button>
          </CardHeader>
          <CardContent>
            {mcpServers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No MCP servers configured. Add one to enable tool capabilities.
              </div>
            ) : (
              <div className="space-y-6">
                {mcpServers.map((server, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`server-name-${index}`}>Server Name</Label>
                        <Input
                          id={`server-name-${index}`}
                          value={server.name}
                          onChange={(e) => handleMcpServerChange(index, "name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`server-type-${index}`}>Server Type</Label>
                        <Select
                          value={server.type}
                          onValueChange={(value) => handleMcpServerChange(index, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sse">SSE</SelectItem>
                            <SelectItem value="http">HTTP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`server-url-${index}`}>Server URL</Label>
                      <Input
                        id={`server-url-${index}`}
                        value={server.url}
                        onChange={(e) => handleMcpServerChange(index, "url", e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`server-default-${index}`}
                        checked={server.isDefault}
                        onChange={(e) => handleMcpServerChange(index, "isDefault", e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`server-default-${index}`}>Default Server</Label>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeMcpServer(index)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end space-x-4 px-0">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
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
        </CardFooter>
      </form>
    </div>
  )
}
