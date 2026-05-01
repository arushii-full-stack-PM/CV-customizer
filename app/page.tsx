import { auth } from "@/auth"
import { CVFormWrapper } from "@/components/cv-form-wrapper"

const TRUST_SIGNALS = [
  { icon: "🔒", text: "Your CV is never stored" },
  { icon: "⚡", text: "Results in under 30 seconds" },
  { icon: "🎯", text: "Tailored to every job" },
]

export default async function Home() {
  const session = await auth()

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
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.text} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
              <span>{signal.icon}</span>
              <span>{signal.text}</span>
            </div>
          ))}
        </div>

<p className="mb-3 text-center text-sm text-slate-300">
  {session
    ? `✅ Signed in as ${session.user?.email}`
    : "🔐 We use sign-in to prevent abuse and keep your results private."}
</p>

<div className="w-full mb-20">
  <CVFormWrapper isSignedIn={!!session} />
</div>

      </div>
    </div>
  )
}
