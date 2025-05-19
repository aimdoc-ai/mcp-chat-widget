"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Layers, Server, History, MoveRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted/50 overflow-hidden">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left space-y-6">
              <Badge variant="outline" className="animate-fade-in gap-2">
                <span className="text-muted-foreground">Design to be Embedded</span>
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                The fastest way to embed MCP-powered AI chats
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md">
                Developer tool to remotely configure and embed chat services with model context protocol.
              </p>
              
              <div className="flex gap-4 pt-2">
                <Button size="lg" className="px-6 gap-2" asChild>
                  <Link href="/admin">
                    Manage Widgets <MoveRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-6" asChild>
                  <Link href="/webcomponent-example">
                    View Demo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="p-6 bg-primary/5 border rounded-xl shadow-lg relative z-10 transform transition-all">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-semibold">AI Chat Widget</h3>
                  </div>
                  <div className="rounded-lg border bg-card p-4 mb-3">
                    <p className="text-sm">How can I help you today?</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-4 ml-auto max-w-[80%] mb-3">
                    <p className="text-sm">Tell me about your MCP tools.</p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm">MCP tools provide powerful capabilities like file access, API integrations, and more...</p>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-3xl blur-2xl opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg max-w-2xl text-muted-foreground">
              Everything you need to create and manage AI chat widgets with advanced capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="group flex flex-col items-start p-6 border rounded-xl bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Customizable Widgets</h3>
              <p className="text-sm text-muted-foreground">
                Create chat widgets with custom positions, sizes, and AI providers.
              </p>
            </div>
            
            <div className="group flex flex-col items-start p-6 border rounded-xl bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">MCP Tool Support</h3>
              <p className="text-sm text-muted-foreground">
                Connect to MCP servers to give your chat widgets access to powerful tools.
              </p>
            </div>
            
            <div className="group flex flex-col items-start p-6 border rounded-xl bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multiple Providers</h3>
              <p className="text-sm text-muted-foreground">
                Choose between OpenAI and Anthropic models for each widget.
              </p>
            </div>
            
            <div className="group flex flex-col items-start p-6 border rounded-xl bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Conversation History</h3>
              <p className="text-sm text-muted-foreground">
                Chat history is automatically saved for each session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to build your own AI chat experience?
            </h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Get started with MCP-powered AI chat widgets today and provide your users with a seamless AI experience.
            </p>
            <Button size="lg" className="px-8" asChild>
              <Link href="/admin">
                Start Building Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
