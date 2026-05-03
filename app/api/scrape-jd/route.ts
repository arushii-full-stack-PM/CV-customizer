import { NextRequest, NextResponse } from "next/server"
import { checkIpLimit, getIp } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req)
    const ipCheck = await checkIpLimit(ip, "scrape-jd", 20, 3600)
    if (!ipCheck.allowed) {
      return NextResponse.json({
        error: "Too many requests. Please try again in an hour."
      }, { status: 429 })
    }

    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CVCustomizer/1.0)",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 400 })
    }

    const html = await response.text()
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000)

    return NextResponse.json({ text })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
