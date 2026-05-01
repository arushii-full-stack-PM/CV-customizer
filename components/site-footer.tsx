export function SiteFooter() {
  return (
    <footer className="border-t border-primary/20 bg-primary/5 px-6 py-2">
      <div className="mx-auto max-w-7xl flex flex-row items-center justify-between gap-4">
        
        {/* Left: Avatar + Name + Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            AG
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Created & Maintained by</p>
            <p className="text-xs font-bold text-white">Arushii Gupta</p>
            <p className="text-[10px] text-slate-300 leading-snug">Full-stack Product Manager · 9 yrs in e-commerce · Expert in shipping end-to-end AI-powered products · DM on LinkedIn for interesting conversations</p>
          </div>
        </div>

        {/* Right: LinkedIn button */}
        <a href="https://www.linkedin.com/in/arushii-gupta-1a33b112/" target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity">LinkedIn</a>

      </div>
    </footer>
  )
}
