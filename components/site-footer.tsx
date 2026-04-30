export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-4 pt-6 pb-6">
      <div className="mx-auto max-w-4xl px-6 flex flex-col gap-4">
        
        {/* Compressed Brand Card */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white border border-border shadow-inner">
            AG
          </div>
          
          <div className="flex flex-col text-center sm:text-left flex-grow">
            <p className="text-[8px] font-bold uppercase tracking-widest text-primary">Created by</p>
            <p className="text-base font-bold text-foreground">Arushii Gupta</p>
            <p className="text-[10px] text-text-subtle leading-tight">
              Full-stack PM • 9 yrs e-commerce • Shipping AI Products
            </p>
          </div>

          <a 
            href="https://www.linkedin.com/in/arushii-gupta-1a33b112/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-[10px] font-bold text-black hover:opacity-90 transition-all shadow-sm"
          >
            LinkedIn
          </a>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex justify-between items-center text-[9px] text-text-subtle font-medium uppercase tracking-widest px-1">
          <p>© 2026 CV Customizer</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
