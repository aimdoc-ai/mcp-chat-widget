"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Server, Globe, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MCPServer {
  name: string
  transportType: string
  url: string
}

interface MCPSettingsProps {
  settings: {
    mcpEnabled: boolean
    mcpServers: MCPServer[]
  }
  onSettingsChange: (
    settings: Partial<{
      mcpEnabled: boolean
      mcpServers: MCPServer[]
    }>,
  ) => void
  onAddServer: (server: MCPServer) => void
  onRemoveServer: (index: number) => void
}

export const MCPSettings = ({ settings, onSettingsChange, onAddServer, onRemoveServer }: MCPSettingsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newServer, setNewServer] = useState<MCPServer>({
    name: "",
    transportType: "sse",
    url: "",
  })

  const handleAddServer = () => {
    if (newServer.name && newServer.url) {
      onAddServer(newServer)
      setNewServer({
        name: "",
        transportType: "sse",
        url: "",
      })
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="group relative overflow-hidden w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">MCP Settings</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure Model Context Protocol servers</p>
          </div>
        </div>
        <Switch
          checked={settings.mcpEnabled}
          onCheckedChange={(checked) => onSettingsChange({ mcpEnabled: checked })}
        />
      </div>

      {settings.mcpEnabled && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Connect to Model Context Protocol servers to access additional AI tools.
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>Add Server</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New MCP Server</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Server Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Server Name</label>
                    <Input
                      value={newServer.name}
                      onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                      placeholder="My MCP Server"
                      className="w-full"
                    />
                  </div>

                  {/* Transport Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transport Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                          newServer.transportType === "sse"
                            ? "border-zinc-900 dark:border-zinc-100"
                            : "border-zinc-200 dark:border-zinc-700"
                        }`}
                        onClick={() => setNewServer({ ...newServer, transportType: "sse" })}
                      >
                        <Globe className="w-4 h-4" />
                        <div>
                          <p className="text-sm font-medium">SSE</p>
                          <p className="text-xs text-zinc-500">Server-Sent Events</p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                          newServer.transportType === "http"
                            ? "border-zinc-900 dark:border-zinc-100"
                            : "border-zinc-200 dark:border-zinc-700"
                        }`}
                        onClick={() => setNewServer({ ...newServer, transportType: "http" })}
                      >
                        <Globe className="w-4 h-4" />
                        <div>
                          <p className="text-sm font-medium">HTTP</p>
                          <p className="text-xs text-zinc-500">HTTP Streamable</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Server URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Server URL</label>
                    <Input
                      value={newServer.url}
                      onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                      placeholder="https://mcp.example.com/token/sse"
                      className="w-full"
                    />
                    <p className="text-xs text-zinc-500">Full URL to the MCP server endpoint</p>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleAddServer}>Add Server</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Server List */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {settings.mcpServers.length} {settings.mcpServers.length === 1 ? "server" : "servers"} currently active
            </p>

            {settings.mcpServers.length > 0 ? (
              <div className="space-y-2">
                {settings.mcpServers.map((server, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-zinc-500" />
                      <div>
                        <p className="text-sm font-medium">{server.name}</p>
                        <p className="text-xs text-zinc-500">
                          {server.transportType.toUpperCase()} • {server.url}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveServer(index)}
                      className="h-8 w-8 text-zinc-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                No MCP servers configured. Add a server to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
