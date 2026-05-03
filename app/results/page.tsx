"use client"
import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, AlertTriangle, Zap, BarChart2, FileText } from "lucide-react"

interface AnalysisResult {
  matchScore: number
  scoreBreakdown?: {
    mustHaveSkills: number
    experienceMatch: number
    niceToHave: number
    domainFit: number
    reasoning: string
  }
  matchedKeywords: string[]
  missingKeywords: string[]
  skillsGap: { jdRequires: string; cvHas: string }[]
  suggestedRewrites: { original: string; rewritten: string }[]
  redFlags: string[]
  quickWins: string[]
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444"
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-foreground">{score}%</span>
        </div>
      </div>
      <p className="text-lg font-semibold text-[var(--text-muted)]">Match Score</p>
      <p className="text-sm text-[var(--text-subtle)]">
        {score >= 75
          ? "🟢 Strong match — a few tweaks and you're set!"
          : score >= 40
          ? "🟡 Moderate match — some gaps to address"
          : "🔴 Low match — significant changes recommended"}
      </p>
    </div>
  )
}

function ScoreBreakdown({ breakdown }: { breakdown: NonNullable<AnalysisResult["scoreBreakdown"]> }) {
  const bars = [
    { label: "Must-have Skills", score: breakdown.mustHaveSkills, max: 60 },
    { label: "Experience Match", score: breakdown.experienceMatch, max: 20 },
    { label: "Nice-to-haves", score: breakdown.niceToHave, max: 10 },
    { label: "Domain Fit", score: breakdown.domainFit, max: 10 },
  ]

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
      <h2 className="font-semibold text-foreground mb-5">Score Breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {bars.map((item) => {
          const pct = Math.min(100, (item.score / item.max) * 100)
          const barColor = pct >= 75 ? "bg-green-400" : pct >= 50 ? "bg-yellow-400" : "bg-red-400"
          return (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">{item.label}</span>
                <span className="font-bold text-primary">{item.score}<span className="text-[var(--text-subtle)] font-normal">/{item.max}</span></span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-2 rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      {breakdown.reasoning && (
        <div className="border-t border-white/10 pt-4">
          <p className="text-sm text-[var(--text-muted)] italic">💬 {breakdown.reasoning}</p>
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisResult | null>(null)
  const [expandedRewrite, setExpandedRewrite] = useState<number | null>(null)
  const [notFound, setNotFound] = useState(false)

 useEffect(() => {
  const stored = sessionStorage.getItem("cvAnalysis")
  if (stored) {
    try {
      setData(JSON.parse(stored))
    } catch {
      setNotFound(true)
    }
  } else {
    setNotFound(true)
  }
}, [])

  if (notFound) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg text-[var(--text-muted)]">No analysis found.</p>
        <a href="/" className="text-primary hover:underline">← Go back and analyze your CV</a>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <svg className="h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        <p className="text-[var(--text-muted)]">Loading your results...</p>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 pb-20 pt-10">
      <div className="w-full max-w-5xl">

        {/* Back link */}
        <div className="mb-6">
          <a href="/" className="text-sm text-primary hover:underline">← Analyze Another</a>
        </div>

        {/* Score Ring */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
          <ScoreRing score={data.matchScore} />
        </div>

        {/* Score Breakdown */}
        {data.scoreBreakdown && <ScoreBreakdown breakdown={data.scoreBreakdown} />}

        {/* 6 Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* Matched Keywords */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-green-400 h-5 w-5" />
              <h2 className="font-semibold text-foreground">Matched Keywords</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.matchedKeywords.map((kw) => (
                <span key={kw} className="rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs text-green-400">{kw}</span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="text-red-400 h-5 w-5" />
              <h2 className="font-semibold text-foreground">Missing Keywords</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((kw) => (
                <span key={kw} className="rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs text-red-400">{kw}</span>
              ))}
            </div>
          </div>

          {/* Skills Gap */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="text-primary h-5 w-5" />
              <h2 className="font-semibold text-foreground">Skills Gap</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--text-muted)]">
                  <th className="text-left pb-2">JD Requires</th>
                  <th className="text-left pb-2">Your CV Has</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.skillsGap.map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 text-red-400">{row.jdRequires}</td>
                    <td className="py-2 text-[var(--text-muted)]">{row.cvHas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Suggested Rewrites */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-primary h-5 w-5" />
              <h2 className="font-semibold text-foreground">Suggested Rewrites</h2>
            </div>
            <div className="flex flex-col gap-3">
              {data.suggestedRewrites.map((item, i) => (
                <div key={i} className="rounded-lg border border-white/10 overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-[var(--text-muted)] hover:bg-white/5"
                    onClick={() => setExpandedRewrite(expandedRewrite === i ? null : i)}
                  >
                    <span className="line-clamp-1">{item.original}</span>
                  </button>
                  {expandedRewrite === i && (
                    <div className="px-4 py-3 bg-primary/10 border-t border-white/10 text-sm text-primary">
                      ✍️ {item.rewritten}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-yellow-400 h-5 w-5" />
              <h2 className="font-semibold text-foreground">Red Flags</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {data.redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <AlertTriangle className="text-yellow-400 h-4 w-4 mt-0.5 shrink-0" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Wins */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-primary h-5 w-5" />
              <h2 className="font-semibold text-foreground">Quick Wins</h2>
            </div>
            <ol className="flex flex-col gap-3">
              {data.quickWins.map((win, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">{i + 1}</span>
                  {win}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </main>
  )
}
