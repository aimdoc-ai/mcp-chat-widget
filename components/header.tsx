import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl mx-auto px-4 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="font-medium">ChatMCP Widget</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="text-sm font-normal">
            <Link href="/admin">Manage Widgets</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-sm font-normal">
            <Link href="/demo">Playground</Link>
          </Button>
          <Button size="sm" asChild className="ml-4 text-sm">
            <Link href="/admin/widgets/new">Create Widget</Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 