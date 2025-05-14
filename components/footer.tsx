import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t py-4">
      <div className="container max-w-screen-xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <p className="text-xs text-muted-foreground mb-2">
          &copy; {new Date().getFullYear()} MCP Chat Widget. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  )
} 