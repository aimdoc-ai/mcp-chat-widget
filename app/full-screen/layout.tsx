export default function FullScreenChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background">
      {children}
    </div>
  )
} 