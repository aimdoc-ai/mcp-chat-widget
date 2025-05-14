"use client"

import React from "react"
import ChatWidgetBuilder from "@/components/chat-widget-builder/chat-widget-builder"

interface WidgetFormProps {
  params: Promise<{
    id: string
  }>
}

export default function WidgetForm({ params }: WidgetFormProps) {
  const unwrappedParams = React.use(params) as { id: string }
  
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <ChatWidgetBuilder widgetId={unwrappedParams.id} />
    </main>
  )
}
