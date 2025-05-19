"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import { Copy, Check, ArrowLeft, Code, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface EmbedPageProps {
  params: Promise<{
    id: string
  }>
}

// Type definitions for tab data
interface EmbedTabData {
  id: string
  label: string
  description: string
  codeKey: keyof typeof embedTypes
  benefits?: string[]
}

// Define the embed code types
const embedTypes = {
  "one-line": "oneLine",
  "web-component": "webComponent",
  "nextjs": "nextjs",
  "react": "react"
} as const

// Define tab data
const tabsData: EmbedTabData[] = [
  {
    id: "one-line",
    label: "Static Site",
    description: "Just add this one line of code to your HTML",
    codeKey: "one-line",
    benefits: [
      "Simplest installation with minimal code",
      "Automatically loads all required resources",
      "Widget is positioned at the bottom corner by default",
      "Updates automatically when you change widget settings"
    ]
  },
  {
    id: "web-component",
    label: "Customizeable",
    description: "Use as a standard web component in your HTML",
    codeKey: "web-component",
    benefits: [
      "More control over widget placement in your DOM",
      "Customize component attributes directly in HTML",
      "Works with any framework or vanilla JavaScript",
      "Standard HTML Custom Element API"
    ]
  },
  {
    id: "nextjs",
    label: "Next.js",
    description: "Copy and paste this code into your Next.js app. Import the widget component and use it in any page.tsx or layout.tsx file.",
    codeKey: "nextjs"
  },
  {
    id: "react",
    label: "React",
    description: "Copy and paste this code into your React app.",
    codeKey: "react"
  }
];

export default function EmbedPage({ params }: EmbedPageProps) {
  const unwrappedParams = React.use(params) as { id: string }
  const [embedCodes, setEmbedCodes] = useState<{
    oneLine: string;
    webComponent: string;
    nextjs: string;
    react: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [widget, setWidget] = useState<any>(null)

  useEffect(() => {
    async function fetchEmbedCode() {
      try {
        const response = await fetch(`/api/widgets/${unwrappedParams.id}/embed`)
        if (response.ok) {
          const data = await response.json()
          setEmbedCodes(data.embedCodes)
          setWidget(data.widget)
        } else {
          setError("Failed to fetch embed code")
        }
      } catch (error) {
        setError("An error occurred while fetching embed code")
      } finally {
        setLoading(false)
      }
    }

    fetchEmbedCode()
  }, [unwrappedParams.id])

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(null), 2000)
    })
  }

  // Component for rendering code blocks
  const CodeBlock = ({ tabId, codeKey }: { tabId: string, codeKey: keyof typeof embedTypes }) => {
    const embedKey = embedTypes[codeKey] as keyof typeof embedCodes;
    const codeContent = embedCodes ? embedCodes[embedKey] : "";
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">
              {tabsData.find(tab => tab.id === tabId)?.description}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(codeContent || "", tabId)}
              className="h-7 px-2"
            >
              {copied === tabId ? (
                <Check className="h-4 w-4 mr-1" /> 
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied === tabId ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="relative">
            <div className="bg-muted rounded-md p-4 overflow-x-auto">
              <pre className="text-sm">{codeContent}</pre>
            </div>
          </div>
        </div>
        
        {tabsData.find(tab => tab.id === tabId)?.benefits && (
          <div className="rounded-md bg-muted/50 p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Benefits of {tabId === "one-line" ? "One-Line" : 
                          tabId === "web-component" ? "Web Component" : 
                          tabId === "nextjs" ? "Next.js" : 
                          "React"} Embed
            </h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              {tabsData.find(tab => tab.id === tabId)?.benefits?.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">{error}</p>
        <Button asChild variant="outline">
          <Link href={`/admin/widgets/${unwrappedParams.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Widget
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" asChild size="sm" className="mb-2 -ml-2">
            <Link href={`/admin/widgets/${unwrappedParams.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Widget
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Embed Widget: {widget?.name}</h1>
          <p className="text-muted-foreground">Share your chat widget with users</p>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/demo?widgetId=${unwrappedParams.id}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview Widget
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Install Your Widget</CardTitle>
          <CardDescription>
            Choose an embedding method that works best with your website or application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="one-line">
            <TabsList className="mb-4">
              {tabsData.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabsData.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                <CodeBlock tabId={tab.id} codeKey={tab.codeKey} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget URL (for testing)</CardTitle>
          <CardDescription>
            Share this URL to test your widget in a standalone page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              readOnly 
              value={`${window.location.origin}/demo?widgetId=${unwrappedParams.id}`} 
              className="font-mono text-sm"
            />
            <Button 
              variant="outline"
              onClick={() => handleCopy(`${window.location.origin}/demo?widgetId=${unwrappedParams.id}`, "demo-url")}
            >
              {copied === "demo-url" ? (
                <Check className="h-4 w-4 mr-1" /> 
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied === "demo-url" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 