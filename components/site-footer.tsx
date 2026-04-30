export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="mx-auto max-w-5xl px-6 flex flex-col gap-8">

        {/* Branding Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              AG
            </div>
            {/* Info */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Created by
              </p>
              <p className="text-base font-bold text-foreground">Arushii Gupta</p>
              <p className="text-sm text-[var(--text-muted)]">
                Full-stack Product Manager · 9 yrs in e-commerce · Now shipping AI-powered products end-to-end
              </p>
            </div>
          </div>

          {/* LinkedIn CTA */}
          <a 
            href="https://www.linkedin.com/in/arushii-gupta-1a33b112/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.027-3.063-1.867-3.063-1.869 0-2.156 1.459-2.156 2.967v5.7h-3v-10h2.879v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.608v5.588z"/>
            </svg>
            Let's talk
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-[var(--text-subtle)]">
            &copy; {new Date().getFullYear()} CV Customizer. All rights reserved.
          </p>
          <nav aria-label="Footer navigation" className="flex items-center gap-5">
            <a href="#" className="text-sm text-[var(--text-subtle)] transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-[var(--text-subtle)] transition-colors hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-[var(--text-subtle)] transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>

      </div>
    </footer>
  )
}
