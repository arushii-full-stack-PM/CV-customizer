export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-0 pt-2 pb-3">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg">
            AG
          </div>
          <div className="flex flex-col text-center sm:text-left flex-grow gap-0.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Created & Maintained by</p>
            <p className="text-sm font-bold text-white">Arushii Gupta</p>
            <p className="text-sm text-slate-300 leading-snug">Full-stack Product Manager · 9 yrs in e-commerce (pricing, conversion, growth) · Expert in shipping end-to-end AI-powered products · DM on LinkedIn for interesting conversations</p>
          </div>
          <a href="https://www.linkedin.com/in/arushii-gupta-1a33b112/" target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
