"use client"

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] mt-0 pt-6 pb-8">
      <div className="mx-auto max-w-4xl px-6 flex flex-col gap-6">

        {/* Branding Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            AG
          </div>
          <div className="flex flex-col gap-1 text-center sm:text-left flex-grow">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Created by
            </p>
            <p className="text-base font-bold text-foreground">
              Arushii Gupta
            </p>
            <p className="text-sm text-[var(--text-muted)] leading-snug">
              Full-stack Product Manager · 9 yrs in e-commerce (pricing, conversion, growth) · Now shipping AI-powered products end-to-end · Open to opportunities
            </p>
          </div>
          
            href="https://www.linkedin.com/in/arushii-gupta-1a33b112/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {"Let's talk on LinkedIn"}
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[var(--text-subtle)] px-1 gap-3">
          <p>{"© 2026 CV Customizer. All rights reserved."}</p>
          <nav className="flex gap-5">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </nav>
        </div>

      </div>
    </footer>
  )
}
