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
          content: `You are a senior technical recruiter and ATS expert with deep understanding of semantic equivalence in job matching.

Task: Audit the CV against the Job Description with HIGH semantic intelligence.
Output: Return ONLY a raw JSON object. No preamble, no markdown, no backticks.

SEMANTIC MATCHING RULES — follow these strictly:
1. Treat semantically equivalent terms as MATCHES. Examples:
   - "B2B2C" matches "B2B" or "B2C" contexts
   - "Product Manager" matches "PM", "Product Lead", "Product Owner"
   - "e-commerce" matches "online retail", "digital commerce"
   - "AI-powered" matches "machine learning", "ML", "artificial intelligence"
   - "stakeholder management" matches "cross-functional collaboration"
   - "pricing strategy" matches "monetization", "revenue optimization"
   - "growth" matches "user acquisition", "retention", "conversion"
   - Acronyms match their full forms and vice versa
2. If a concept appears in the CV even with different wording, mark it as a MATCH
3. Only mark as MISSING if the concept is genuinely absent — not just differently worded
4. For skillsGap, only list skills with NO semantic equivalent in the CV
5. Keep each string value under 100 characters
6. Limit matchedKeywords to 10 items max
7. Limit missingKeywords to 8 items max
8. Limit skillsGap to 5 items max
9. Limit suggestedRewrites to 3 items max

Job Description:
${jdText}

CV Text:
${cvText}

Return EXACTLY this JSON structure:
{
  "matchScore": <number 0-100, based on semantic match not just keyword match>,
  "matchedKeywords": ["keyword or concept found in both — use the JD's terminology"],
  "missingKeywords": ["genuinely absent concepts with no semantic equivalent in CV"],
  "skillsGap": [
    { "jdRequires": "specific JD requirement", "cvHas": "closest thing in CV or Not mentioned" }
  ],
  "suggestedRewrites": [
    { "original": "existing CV bullet", "rewritten": "improved version using JD terminology" }
  ],
  "redFlags": ["specific issue that could hurt shortlisting"],
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
