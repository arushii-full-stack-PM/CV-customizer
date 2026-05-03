import { NextRequest, NextResponse } from "next/server"
import pdfParse from "pdf-parse"
import { checkIpLimit, getIp } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req)
    const ipCheck = await checkIpLimit(ip, "parse-cv", 20, 3600)
    if (!ipCheck.allowed) {
      return NextResponse.json({
        error: "Too many requests. Please try again in an hour."
      }, { status: 429 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf")
    const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")

    let text = ""
    let pageCount = 1

    if (isPdf) {
      const parsed = await pdfParse(buffer)
      text = parsed.text
      pageCount = parsed.numpages || 1
    } else if (isDocx) {
      const JSZip = (await import("jszip")).default
      const zip = await JSZip.loadAsync(buffer)
      const xmlFile = zip.file("word/document.xml")
      if (!xmlFile) throw new Error("Invalid docx file")
      const xml = await xmlFile.async("text")
      text = xml
        .replace(/<w:br[^>]*\/>/gi, "\n")
        .replace(/<w:p[ >][^>]*>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\n{3,}/g, "\n\n")
        .trim()
      pageCount = Math.max(1, Math.ceil(text.length / 4000))
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const extractedChars = text.length
    const expectedChars = pageCount * 3000
    const parsePercent = Math.min(100, Math.round((extractedChars / expectedChars) * 100))

    return NextResponse.json({
      text: text.slice(0, 8000),
      parseStats: { extractedChars, pageCount, parsePercent, isPdf }
    })
  } catch (error) {
    console.error("Parse error:", error)
    return NextResponse.json({ error: "Failed to parse file" }, { status: 500 })
  }
}
