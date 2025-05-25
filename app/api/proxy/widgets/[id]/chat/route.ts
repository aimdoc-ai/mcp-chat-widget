import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unwrappedParams = await params
    const id = unwrappedParams.id
    const body = await req.json()
    
    // Forward the request to the remote API
    const response = await fetch(`https://mcpwrapper.app/api/widgets/${id}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    
    // Get the response data as a ReadableStream
    const data = await response.body
    
    // Return the response with the same status and headers
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to proxy request" }, { status: 500 })
  }
} 