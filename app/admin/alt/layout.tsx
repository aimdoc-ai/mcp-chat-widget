import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ChatMCP Widgets',
  description: 'ChatMCP Widgets',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
