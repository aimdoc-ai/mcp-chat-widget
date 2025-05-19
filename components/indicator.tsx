"use client"

import { useEffect, useState } from "react"

interface AIIndicatorProps {
  loading?: boolean
  className?: string
}

export function AIIndicator({ loading = false, className = "" }: AIIndicatorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loading) {
      setVisible(true)
    } else if (visible) {
      // Add a small delay before hiding to complete any animation
      const timer = setTimeout(() => {
        setVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [loading, visible])

  if (!visible) return null

  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-gray-100 relative ${className}`}
      style={{ height: "1.2px" }}
    >
      <div
        className="h-full absolute animate-loop-horizontal bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
        style={{
          width: "20%",
          animationDuration: "2s",
        }}
      />
    </div>
  )
}

// Add this to your global CSS or a local CSS module
const styles = `
@keyframes loop-horizontal {
  0% {
    left: -20%;
  }
  100% {
    left: 100%;
  }
}

.animate-loop-horizontal {
  animation: loop-horizontal linear infinite;
}
`

// Inject the styles if they don't exist
if (typeof document !== "undefined") {
  if (!document.getElementById("ai-indicator-styles")) {
    const styleSheet = document.createElement("style")
    styleSheet.id = "ai-indicator-styles"
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
  }
}
