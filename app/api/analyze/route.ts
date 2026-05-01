import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { jdText, cvText } = await req.json()

    if (!jdText || !cvText) {
      return NextResponse.json({ error: "JD and CV text are required" }, { status: 400 })
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a high-precision ATS engine and technical recruiter.
Task: Audit the provided CV against the Job Description.
Output: Return ONLY a raw JSON object. No preamble, no markdown, no backticks.

STRICT QUALITY CONSTRAINTS:
1. DO NOT use vague phrases like "good fit" or "relevant experience"
2. Every matched keyword must be explicitly present in the CV text
3. If a skill is not explicitly found, it is missing — do not assume
4. Do not mark something as missing if any variation of it appears in the CV

Job Description:
${jdText}

CV Text:
${cvText}

Return EXACTLY this JSON structure with no deviations:
{
  "matchScore": <number 0-100>,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "skillsGap": [
    { "jdRequires": "what JD wants", "cvHas": "what CV shows instead or Not mentioned" }
  ],
  "suggestedRewrites": [
    { "original": "existing CV bullet", "rewritten": "improved version aligned to JD" }
  ],
  "redFlags": ["specific issue 1", "specific issue 2"],
  "quickWins": ["high impact change 1", "high impact change 2", "high impact change 3"]
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
