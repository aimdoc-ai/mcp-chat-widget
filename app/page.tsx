import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Layers, Server, History } from "lucide-react"

export default function Home() {
  return (
    <div className="w-full bg-muted">
      {/* Hero section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm mb-4">
                MCP-powered AI chat widgets
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
                Customize Your AI Chat Experience
              </h1>
              <p className="text-lg mb-8">
                Create AI chat widgets with MCP tool support for your websites, dashboards, and applications.
              </p>
              <div className="flex gap-4">
                <Button className="px-6" asChild>
                  <Link href="/admin">
                    Manage Widgets
                  </Link>
                </Button>
                <Button variant="outline" className="px-6" asChild>
                  <Link href="/webcomponent-example">
                    View Demo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="relative p-4 bg-primary/10 rounded-xl border shadow-lg">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">AI Chat Widget</h3>
                </div>
                <div className="rounded-lg border bg-muted p-3 mb-3">
                  <p className="text-sm">How can I help you today?</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 ml-auto max-w-[80%] mb-3">
                  <p className="text-sm">Tell me about your MCP tools.</p>
                </div>
                <div className="rounded-lg border bg-muted p-3">
                  <p className="text-sm">MCP tools provide powerful capabilities like file access, API integrations, and more...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Powerful Features
            </h2>
            <p className="text-lg max-w-2xl">
              Everything you need to create and manage AI chat widgets with advanced capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center p-6 border rounded-lg text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Customizable Widgets</h3>
              <p className="text-sm">
                Create chat widgets with custom positions, sizes, and AI providers.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 border rounded-lg text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">MCP Tool Support</h3>
              <p className="text-sm">
                Connect to MCP servers to give your chat widgets access to powerful tools.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 border rounded-lg text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multiple Providers</h3>
              <p className="text-sm">
                Choose between OpenAI and Anthropic models for each widget.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 border rounded-lg text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <History className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Conversation History</h3>
              <p className="text-sm">
                Chat history is automatically saved for each session.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
