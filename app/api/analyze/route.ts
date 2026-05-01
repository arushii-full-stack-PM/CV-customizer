import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { jdText, cvText } = await req.json()

    if (!jdText || !cvText) {
      return NextResponse.json({ error: "JD and CV text are required" }, { status: 400 })
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the following CV against the Job Description and return a JSON object only — no explanation, no markdown, just raw JSON.

Job Description:
${jdText}

CV:
${cvText}

Return this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "matchedKeywords": [<list of skills/keywords found in both JD and CV>],
  "missingKeywords": [<list of important JD keywords missing from CV>],
  "skillsGap": [
    { "jdRequires": "<what JD wants>", "cvHas": "<what CV shows instead>" }
  ],
  "suggestedRewrites": [
    { "original": "<existing CV bullet>", "rewritten": "<improved version>" }
  ],
  "redFlags": [<list of things that may hurt shortlisting chances>],
  "quickWins": [<top 5 specific changes to improve match score in the order of importance>]
}`,
        },
      ],
    })

    const rawText = message.content[0].type === "text" ? message.content[0].text : ""
    const clean = rawText.replace(/```json|```/g, "").trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
