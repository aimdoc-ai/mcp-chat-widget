"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Maximize, ArrowDownRight } from "lucide-react"

interface AppearanceSettingsProps {
  settings: {
    minimizeIcon: string
    widgetSize: string
    widgetPosition: string
  }
  onSettingsChange: (
    settings: Partial<{
      minimizeIcon: string
      widgetSize: string
      widgetPosition: string
    }>,
  ) => void
}

export const AppearanceSettings = ({ settings, onSettingsChange }: AppearanceSettingsProps) => {
  return (
    <div className="group relative overflow-hidden w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Appearance Settings</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Customize how your chat widget looks</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Minimize Icon */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Minimize Icon</span>
          </div>
          <Select value={settings.minimizeIcon} onValueChange={(value) => onSettingsChange({ minimizeIcon: value })}>
            <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="message-circle">Message Circle</SelectItem>
              <SelectItem value="message-square">Message Square</SelectItem>
              <SelectItem value="help-circle">Help Circle</SelectItem>
              <SelectItem value="bot">Bot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Widget Size */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Maximize className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Widget Size</span>
          </div>
          <Select value={settings.widgetSize} onValueChange={(value) => onSettingsChange({ widgetSize: value })}>
            <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Widget Position */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Widget Position</span>
          </div>
          <Select
            value={settings.widgetPosition}
            onValueChange={(value) => onSettingsChange({ widgetPosition: value })}
          >
            <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
