"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cpu, Bot } from "lucide-react"

interface ModelSettingsProps {
  settings: {
    modelProvider: string
    model: string
  }
  onSettingsChange: (
    settings: Partial<{
      modelProvider: string
      model: string
    }>,
  ) => void
}

export const ModelSettings = ({ settings, onSettingsChange }: ModelSettingsProps) => {
  // Define available models based on the selected provider
  const getAvailableModels = () => {
    if (settings.modelProvider === "openai") {
      return [
        { value: "gpt-4o", label: "GPT-4o" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
      ]
    } else if (settings.modelProvider === "anthropic") {
      return [
        { value: "claude-3-opus", label: "Claude 3 Opus" },
        { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
        { value: "claude-3-haiku", label: "Claude 3 Haiku" },
      ]
    }
    return []
  }

  // Update model when provider changes
  const handleProviderChange = (provider: string) => {
    const newSettings: Partial<{ modelProvider: string; model: string }> = {
      modelProvider: provider,
    }

    // Set default model for the selected provider
    if (provider === "openai") {
      newSettings.model = "gpt-4o"
    } else if (provider === "anthropic") {
      newSettings.model = "claude-3-opus"
    }

    onSettingsChange(newSettings)
  }

  return (
    <div className="group relative overflow-hidden w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Model Settings</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Choose the AI model for your chat widget</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Model Provider */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Model Provider</span>
          </div>
          <Select value={settings.modelProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Model</span>
          </div>
          <Select value={settings.model} onValueChange={(value) => onSettingsChange({ model: value })}>
            <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getAvailableModels().map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
