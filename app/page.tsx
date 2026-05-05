import { auth } from "@/auth"
import { CVFormWrapper } from "@/components/cv-form-wrapper"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const UNLIMITED_EMAILS = [
  "arushii.gupta@nmims.edu.in",
  "arushii.banasthali@gmail.com",
]

const MAX_ANALYSES = 2

const TRUST_SIGNALS = [
  { icon: "🔒", text: "Your CV is never stored" },
  { icon: "⚡", text: "Results in under 30 seconds" },
  { icon: "🎯", text: "Tailored to every job" },
]

async function getRemainingAnalyses(email: string): Promise<number | null> {
  if (UNLIMITED_EMAILS.includes(email.toLowerCase())) return null
  const key = `usage:email:${email.toLowerCase()}`
  const count = await redis.get<number>(key) || 0
  return Math.max(0, MAX_ANALYSES - count)
}

export default async function Home() {
  const session = await auth()
  const email = session?.user?.email || ""
  const remaining = email ? await getRemainingAnalyses(email) : null

  return (
    <div className="flex flex-col items-center px-4 pt-2 pb-0">
      <div className="w-full max-w-3xl flex flex-col items-center">

        <div className="text-center mb-4 w-full">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold uppercase tracking-wider mb-2">
            AI Engine Active
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-3">
            Tailor your CV to <span className="text-primary">every opportunity.</span>
          </h1>
          <p className="text-text-muted text-[10px] sm:text-xs opacity-80">
            {session
              ? `Welcome back, ${session.user?.name}. Your workspace is ready.`
              : "Connect your Google account to start tailoring your resume with precision AI analysis."}
          </p>
        </div>

        {/* Trust signals */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.text} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
              <span>{signal.icon}</span>
              <span>{signal.text}</span>
            </div>
          ))}
        </div>

        {/* Sign in status + remaining analyses */}
        <div className="mb-3 flex flex-col items-center gap-1.5">
          <p className="text-center text-sm text-slate-300">
            {session
              ? `✅ Signed in with ${session.user?.email}`
              : "🔐 We use sign-in to prevent abuse and keep your results private."}
          </p>
          {session && remaining !== null && (
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
              remaining === 0
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : remaining === 1
                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                : "bg-green-500/10 border-green-500/30 text-green-400"
            }`}>
              {remaining === 0
                ? "❌ No analyses remaining"
                : `🎯 ${remaining} free ${remaining === 1 ? "analysis" : "analyses"} remaining`}
            </div>
          )}
          {session && remaining === null && (
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border bg-primary/10 border-primary/30 text-primary">
              ✨ Unlimited analyses
            </div>
          )}
        </div>

        <div className="w-full mb-20">
          <CVFormWrapper isSignedIn={!!session} remaining={remaining} />
        </div>

      </div>
    </div>
  )
}
