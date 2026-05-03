import { NextRequest, NextResponse } from "next/server"
import pdfParse from "pdf-parse"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf")
    const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")

    let text = ""

    if (isPdf) {
      const parsed = await pdfParse(buffer)
      text = parsed.text
    } else if (isDocx) {
      // Extract text from docx by reading the XML inside the zip
      const JSZip = (await import("jszip")).default
      const zip = await JSZip.loadAsync(buffer)
      const xmlFile = zip.file("word/document.xml")
      if (!xmlFile) throw new Error("Invalid docx file")
      const xml = await xmlFile.async("text")
      // Strip XML tags to get plain text
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
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    return NextResponse.json({ text: text.slice(0, 8000) })
  } catch (error) {
    console.error("Parse error:", error)
    return NextResponse.json({ error: "Failed to parse file" }, { status: 500 })
  }
}
