import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { jdText, cvText, email } = await req.json()

    if (!jdText || !cvText) {
      return NextResponse.json({ error: "JD and CV text are required" }, { status: 400 })
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a brutally honest, senior technical recruiter with 20 years of experience. You do NOT inflate scores. You call out gaps directly.

Task: Audit the CV against the Job Description with HIGH semantic intelligence.
Output: Return ONLY a raw JSON object. No preamble, no markdown, no backticks.

SEMANTIC MATCHING RULES:
1. Treat semantically equivalent terms as MATCHES. Examples:
   - "B2B2C" matches "B2B" or "B2C" contexts
   - "Product Manager" matches "PM", "Product Lead", "Product Owner"
   - "e-commerce" matches "online retail", "digital commerce"
   - "AI-powered" matches "machine learning", "ML", "artificial intelligence"
   - "stakeholder management" matches "cross-functional collaboration"
   - "pricing strategy" matches "monetization", "revenue optimization"
   - Acronyms match their full forms and vice versa
2. If a concept appears in the CV even with different wording, mark it as a MATCH
3. Only mark as MISSING if the concept is genuinely absent with no semantic equivalent
4. For skillsGap, only list skills with NO semantic equivalent in CV

SCORING RUBRIC — follow this strictly, do NOT default to 70-75%:
- 90-100: Candidate meets ALL must-have AND nice-to-have requirements. Exceptional fit. Rare.
- 75-89: Meets all must-have requirements, missing only 1-2 minor nice-to-haves. Strong fit.
- 60-74: Meets most must-haves but missing 1-2 clearly stated critical requirements.
- 40-59: Meets roughly half the must-haves. Significant gaps in core requirements.
- 20-39: Meets few requirements. Major reskilling or experience gap exists.
- 0-19: Fundamentally wrong profile. Wrong domain, wrong level, wrong skills.

IMPORTANT SCORING NOTES:
- Most real-world applications fall between 35-65%
- Only give 75%+ if the CV genuinely covers core JD requirements well with evidence
- Reserve 85%+ for truly exceptional matches — near-perfect alignment
- If you find yourself scoring 70-75%, challenge yourself: are there real gaps? Score lower if yes
- Be specific: a CV with irrelevant experience should score 25-45%, not 65%

WEIGHTED SCORING — calculate using these weights:
- Must-have skills & experience: 60 points max
- Years of experience match: 20 points max
- Nice-to-have skills: 10 points max
- Domain & industry fit: 10 points max
- Add all 4 components to get final matchScore out of 100

CONSTRAINTS:
- Keep each string value under 120 characters
- Limit matchedKeywords to 10 items max
- Limit missingKeywords to 8 items max
- Limit skillsGap to 5 items max
- Limit suggestedRewrites to 3 items max
- Limit redFlags to 4 items max
- Limit quickWins to 3 items max

Job Description:
${jdText}

CV Text:
${cvText}

Return EXACTLY this JSON structure with no deviations:
{
  "matchScore": <final score 0-100 calculated using weighted rubric above>,
  "scoreBreakdown": {
    "mustHaveSkills": <0-60, score for must-have skills match>,
    "experienceMatch": <0-20, score for years and level of experience match>,
    "niceToHave": <0-10, score for nice-to-have skills>,
    "domainFit": <0-10, score for domain and industry alignment>,
    "reasoning": "<2-3 sentences explaining the score honestly>"
  },
  "matchedKeywords": ["keyword or concept found in both — use JD terminology"],
  "missingKeywords": ["genuinely absent concepts with no semantic equivalent in CV"],
  "skillsGap": [
    { "jdRequires": "specific JD requirement", "cvHas": "closest thing in CV or Not mentioned" }
  ],
  "suggestedRewrites": [
    { "original": "existing CV bullet", "rewritten": "improved version using JD terminology" }
  ],
  "redFlags": ["specific issue that could hurt shortlisting chances"],
  "quickWins": ["high impact change 1", "high impact change 2", "high impact change 3"]
}`,
        },
      ],
    })

    const rawText = message.content[0].type === "text" ? message.content[0].text : ""
    const clean = rawText.replace(/```json|```/g, "").trim()
    const result = JSON.parse(clean)

    // Validate matchScore matches breakdown
    if (result.scoreBreakdown) {
      const { mustHaveSkills, experienceMatch, niceToHave, domainFit } = result.scoreBreakdown
      const calculatedScore = (mustHaveSkills || 0) + (experienceMatch || 0) + (niceToHave || 0) + (domainFit || 0)
      // If breakdown doesn't add up to matchScore, use calculated score
      if (Math.abs(calculatedScore - result.matchScore) > 5) {
        result.matchScore = calculatedScore
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
