"use client"

import React from "react"
import ChatWidgetBuilder from "@/components/chat-widget-builder/chat-widget-builder"

export default function AltWidgetForm() {
  // For the alt page, we'll always treat it as a new widget
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <ChatWidgetBuilder widgetId="new" />
    </main>
  )
}
