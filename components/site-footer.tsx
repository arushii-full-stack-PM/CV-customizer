export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-[var(--text-subtle)]">
            &copy; {new Date().getFullYear()} CV Customizer. All rights reserved.
          </p>
          <nav aria-label="Footer navigation" className="flex items-center gap-5">
            <a
              href="#"
              className="text-sm text-[var(--text-subtle)] transition-colors hover:text-foreground"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-[var(--text-subtle)] transition-colors hover:text-foreground"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-[var(--text-subtle)] transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
