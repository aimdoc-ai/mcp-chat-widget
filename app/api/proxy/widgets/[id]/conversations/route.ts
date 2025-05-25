import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unwrappedParams = await params
    const id = unwrappedParams.id
    
    // Forward the request to the remote API
    const response = await fetch(`https://mcpwrapper.app/api/widgets/${id}/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    // Get the response data
    const data = await response.json()
    
    // Return the response with the same status
    return NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to proxy request" }, { status: 500 })
  }
} 