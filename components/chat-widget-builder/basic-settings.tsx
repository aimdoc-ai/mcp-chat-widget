"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Text, MessageSquare, Sparkles } from "lucide-react"

interface BasicSettingsProps {
  settings: {
    projectName: string
    chatDescription: string
    systemPrompt: string
  }
  onSettingsChange: (
    settings: Partial<{
      projectName: string
      chatDescription: string
      systemPrompt: string
    }>,
  ) => void
}

export const BasicSettings = ({ settings, onSettingsChange }: BasicSettingsProps) => {
  return (
    <div className="group relative overflow-hidden w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Basic Settings</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Configure the basic information for your chat widget
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Project Name */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Text className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Project Name</span>
          </div>
          <Input
            value={settings.projectName}
            onChange={(e) => onSettingsChange({ projectName: e.target.value })}
            placeholder="Enter project name"
            className="w-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-100"
          />
        </div>

        {/* Chat Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Chat Description</span>
          </div>
          <Input
            value={settings.chatDescription}
            onChange={(e) => onSettingsChange({ chatDescription: e.target.value })}
            placeholder="Enter a brief description of your chat widget"
            className="w-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-100"
          />
        </div>

        {/* System Prompt */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">System Prompt</span>
          </div>
          <Textarea
            value={settings.systemPrompt}
            onChange={(e) => onSettingsChange({ systemPrompt: e.target.value })}
            placeholder="Enter the system prompt for your AI assistant"
            className="w-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-100 min-h-[100px]"
          />
          <p className="text-xs text-zinc-500">
            This is the initial instruction given to the AI model to define its behavior.
          </p>
        </div>
      </div>
    </div>
  )
}
