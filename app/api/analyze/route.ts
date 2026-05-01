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
      model: "claude-3-5-sonnet-20240620", // Recommendation: Sonnet is much better at strict JSON than Haiku
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: `You are a high-precision Data Extraction Engine and Technical Recruiter. 
Task: Audit the provided CV against the Job Description. 
Output: Return ONLY a raw JSON object. No preamble, no markdown tags (no \`\`\`json), no conversational filler.

STRICT QUALITY CONSTRAINTS:
1. DO NOT use vague phrases (e.g., "good fit", "relevant experience").
2. EVERY match score must be grounded in direct evidence. 
3. If a skill isn't explicitly found, it is a "Gap". Do not assume.
4. "parseScore": Evaluate the raw text quality of the CV (0-100). Penalize if text is garbled, missing headers, or looks like poor OCR/PDF extraction.

Job Description:
${jdText}

CV Text:
${cvText}

Return this exact JSON structure:
{
  "parseMetrics": {
    "parseScore": <number 0-100>,
    "extractionQuality": "High | Medium | Low",
    "parsingNote": "Brief technical reason for the score"
  },
  "matchAnalysis": {
    "overallMatchScore": <number 0-100>,
    "keyRequirements": [
      { 
        "requirement": "string", 
        "status": "Match | Partial | Gap", 
        "evidence": "Direct quote or specific metric from CV" 
      }
    ],
    "skillsGap": ["Specific missing hard skills"],
    "redFlags": ["Formatting issues, tenure gaps, or missing mandatory certifications"],
    "quickWins": ["Top 3 high-impact changes to improve this specific match"]
  }
}`,
        },
      ],
    })

    const rawText = message.content[0].type === "text" ? message.content[0].text : ""
    
    // Safety check to remove any stray markdown if Claude ignores the 'no-markdown' rule
    const cleanJSON = rawText.replace(/```json|```/g, "").trim()
    const result = JSON.parse(cleanJSON)

    /**
     * LOGIC FOR PERCENTILE (N >= 25)
     * This part happens AFTER the AI response.
     * * 1. Save 'result.parseMetrics.parseScore' to your DB.
     * 2. const totalRecords = await db.count();
     * 3. if (totalRecords >= 25) {
     * const rank = await db.getRank(result.parseMetrics.parseScore);
     * result.parseMetrics.percentile = (rank / totalRecords) * 100;
     * } else {
     * result.parseMetrics.percentile = "Pending (Requires 25 samples)";
     * }
     */

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
