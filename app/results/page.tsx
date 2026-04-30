"use client"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle2, XCircle, AlertTriangle, Zap, BarChart2, FileText } from "lucide-react"

const MOCK_DATA = {
  score: 74,
  matchedKeywords: ["React", "TypeScript", "REST APIs", "Agile", "Git", "Node.js"],
  missingKeywords: ["GraphQL", "AWS", "Docker", "CI/CD", "PostgreSQL"],
  skillsGap: [
    { jdRequires: "GraphQL APIs", cvHas: "REST APIs only" },
    { jdRequires: "AWS deployment", cvHas: "No cloud experience" },
    { jdRequires: "Docker containers", cvHas: "Not mentioned" },
  ],
  suggestedRewrites: [
    {
      original: "Worked on frontend features using React",
      rewritten: "Engineered scalable React components improving page load speed by 40%",
    },
    {
      original: "Helped with API integration",
      rewritten: "Designed and integrated 10+ REST APIs enabling seamless data exchange across services",
    },
  ],
  redFlags: [
    "Employment gap of 8 months not explained",
    "No measurable achievements mentioned",
    "Job title mismatch — JD says 'Senior' but CV shows junior-level responsibilities",
  ],
  quickWins: [
    "Add GraphQL to your skills section if you have any exposure to it",
    "Quantify your achievements with numbers and percentages",
    "Rewrite your summary to mirror the JD language",
  ],
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444"
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3 py-10">
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
        {score >= 70 ? "🟢 Strong match — a few tweaks and you're set!" : score >= 40 ? "🟡 Moderate match — some gaps to address" : "🔴 Low match — significant changes recommended"}
      </p>
    </div>
  )
}

export default function ResultsPage() {
  const [expandedRewrite, setExpandedRewrite] = useState<number | null>(null)
  const data = MOCK_DATA

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar
        isSignedIn={true}
        onSignIn={() => {}}
        onSignOut={() => {}}
      />

      <main className="flex flex-1 flex-col items-center px-6 pb-20 pt-32">
        <div className="w-full max-w-5xl">

          {/* Analyze Another button */}
          <div className="mb-6">
            <a href="/" className="text-sm text-primary hover:underline">← Analyze Another</a>
          </div>

          {/* Score Ring */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
            <ScoreRing score={data.score} />
          </div>

          {/* 6 Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            {/* Card 1 - Matched Keywords */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-green-400 h-5 w-5" />
                <h2 className="font-semibold text-foreground">Matched Keywords</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.matchedKeywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs text-green-400">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2 - Missing Keywords */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="text-red-400 h-5 w-5" />
                <h2 className="font-semibold text-foreground">Missing Keywords</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.missingKeywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs text-red-400">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 3 - Skills Gap */}
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

            {/* Card 4 - Suggested Rewrites */}
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

            {/* Card 5 - Red Flags */}
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

            {/* Card 6 - Quick Wins */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-primary h-5 w-5" />
                <h2 className="font-semibold text-foreground">Quick Wins</h2>
              </div>
              <ol className="flex flex-col gap-3">
                {data.quickWins.map((win, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {win}
                  </li>
                ))}
              </ol>
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
