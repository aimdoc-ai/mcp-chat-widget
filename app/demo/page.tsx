"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { WidgetChat } from "@/components/widget-chat"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Play } from "lucide-react"

// Client component that uses useSearchParams
function DemoContent() {
  const [widgetId, setWidgetId] = useState<number | null>(null)
  const [inputWidgetId, setInputWidgetId] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const widgetIdParam = searchParams.get("widgetId")
    if (widgetIdParam) {
      const id = Number.parseInt(widgetIdParam)
      if (!isNaN(id)) {
        setWidgetId(id)
        setInputWidgetId(widgetIdParam)
      }
    }
  }, [searchParams])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = Number.parseInt(inputWidgetId)
    if (!isNaN(id)) {
      setWidgetId(id)
    }
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Button variant="ghost" asChild className="mb-4 group">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mb-2">Widget Demo</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Test your chat widgets with real-time preview
        </p>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <Card className="border">
          <CardHeader className="text-center">
            <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Test Your Widget</CardTitle>
            <CardDescription>Enter a widget ID to load and test your chat widget</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="widgetId">Widget ID</Label>
                <Input
                  id="widgetId"
                  value={inputWidgetId}
                  onChange={(e) => setInputWidgetId(e.target.value)}
                  placeholder="Enter widget ID number"
                  required
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Load Widget
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/50 py-3 flex justify-center">
            <p className="text-xs text-muted-foreground">You can find widget IDs in the <Link href="/admin" className="underline underline-offset-4 hover:text-primary transition-colors">admin dashboard</Link></p>
          </CardFooter>
        </Card>
      </div>

      {widgetId && (
        <div className="py-6 border-t max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Widget Preview</h2>
          <WidgetChat widgetId={widgetId} />
        </div>
      )}
    </div>
  )
}

// Loading fallback for Suspense
function DemoFallback() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Button variant="ghost" asChild className="mb-4 group">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mb-2">Widget Demo</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Loading demo...
        </p>
      </div>
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={<DemoFallback />}>
      <DemoContent />
    </Suspense>
  )
}
