export function SiteFooter() {
  return (
    <footer className="h-[60px] border-t border-border bg-background flex items-center">
      <div className="mx-auto w-full max-w-7xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
            AG
          </div>
          <p className="text-xs text-text-muted">
            Built by <span className="text-foreground font-medium">Arushii Gupta</span> 
            <span className="hidden sm:inline"> • Shipping AI Products</span>
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a 
            href="https://www.linkedin.com/in/arushii-gupta-1a33b112/"
            target="_blank"
            className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider"
          >
            LinkedIn
          </a>
          <p className="text-[11px] text-text-subtle hidden md:block">
            © {new Date().getFullYear()} CV Customizer
          </p>
        </div>
      </div>
    </footer>
  );
}
