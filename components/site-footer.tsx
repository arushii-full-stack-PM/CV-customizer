export function SiteFooter() {
  return (
    <footer className="border-t-2 border-primary bg-slate-800/50 px-6 py-3">
      <div className="mx-auto max-w-7xl flex flex-row items-center gap-4">

        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-lg shadow-primary/30">
          AG
        </div>

        {/* Name + LinkedIn + Tagline grouped together */}
        <div className="flex flex-col gap-0.5 flex-grow">
          <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Created & Maintained by</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-white">Arushii Gupta</p>
            <a href="https://www.linkedin.com/in/arushii-gupta-1a33b112/" target="_blank" rel="noopener noreferrer" className="rounded-md bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white hover:opacity-90 transition-opacity shadow-sm shadow-primary/40">LinkedIn</a>
          </div>
          <p className="text-[13px] text-slate-300 leading-snug">Full-stack Product Manager · 9 yrs in e-commerce · Expert in shipping end-to-end AI-powered products · DM on LinkedIn for interesting conversations</p>
        </div>

      </div>
    </footer>
  )
}
