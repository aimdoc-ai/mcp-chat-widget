"use client"

import { FullScreenChat } from "@/components/full-screen-chat"

export default function FullScreenChatExamplePage() {
  return (
    <div className="flex flex-col max-w-7xl mx-auto h-[90vh] md:p-8">
      <div className="flex-grow h-full w-full">
        <FullScreenChat 
          widgetId={2}
        />
      </div>
    </div>
  )
} 