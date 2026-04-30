export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-10 pt-10 pb-8">
      <div className="mx-auto max-w-5xl px-6 flex flex-col gap-6">
        
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row items-center gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white border border-border">
            AG
          </div>
          
          <div className="flex flex-col text-center sm:text-left flex-grow">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Created by</p>
            <p className="text-lg font-bold text-foreground">Arushii Gupta</p>
            <p className="text-[11px] text-text-subtle leading-tight">
              Full-stack PM • 9 years in e-commerce • Shipping AI products
            </p>
          </div>

          <a 
            href="https://www.linkedin.com/in/arushii-gupta-1a33b112/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[11px] font-bold text-black hover:opacity-90 transition-all"
          >
            LinkedIn
          </a>
        </div>

        <div className="flex justify-between items-center text-[10px] text-text-subtle font-medium uppercase tracking-widest px-1">
          <p>© {new Date().getFullYear()} CV Customizer</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
