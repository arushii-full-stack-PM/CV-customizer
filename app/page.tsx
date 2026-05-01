import { auth } from "@/auth"
import { CVFormWrapper } from "@/components/cv-form-wrapper"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-0">
      <div className="w-full max-w-3xl flex flex-col items-center">

        <div className="text-center mb-6 w-full">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold uppercase tracking-wider mb-3">
            AI Engine Active
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-1">
            Tailor your CV to <span className="text-primary">every opportunity.</span>
          </h1>
          <p className="text-text-muted text-[10px] sm:text-xs opacity-80">
            {session
              ? `Welcome back, ${session.user?.name}. Your workspace is ready.`
              : "Connect your Google account to start tailoring your resume with precision AI analysis."}
          </p>
        </div>

        <div className="w-full">
          <CVFormWrapper isSignedIn={!!session} />
        </div>

      </div>
    </div>
  )
}
