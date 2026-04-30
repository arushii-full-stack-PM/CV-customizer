"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { CVForm } from "@/components/cv-form"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle2 } from "lucide-react"

const TRUST_BADGES = [
  "AI-powered keyword matching",
  "ATS-friendly suggestions",
  "Instant analysis",
]

export default function HomePage() {
  // Simulated auth state – toggled via the sign-in / sign-out buttons
  const [isSignedIn, setIsSignedIn] = useState(false)

  const handleSignIn = () => setIsSignedIn(true)
  const handleSignOut = () => setIsSignedIn(false)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar
        isSignedIn={isSignedIn}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* ── Hero + Form ───────────────────────────────────────────── */}
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-32"
      >
        {/* Hero text */}
        <div className="mb-10 max-w-2xl text-center">
          {/* Pill badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Powered by AI
          </div>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Tailor your CV to{" "}
            <span className="text-primary">every job.</span>
          </h1>
          <p className="mt-4 text-pretty text-lg text-[var(--text-muted)] sm:text-xl">
            Get shortlisted faster.
          </p>

          {/* Trust badges */}
          <ul
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            aria-label="Key features"
          >
            {TRUST_BADGES.map((badge) => (
              <li key={badge} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {/* Form card – capped width */}
        <div className="w-full max-w-xl">
          <CVForm isSignedIn={isSignedIn} onSignIn={handleSignIn} />
        </div>

        {/* Social proof */}
        {!isSignedIn && (
          <p className="mt-6 text-center text-xs text-[var(--text-subtle)]">
            No credit card required &middot; Free to get started
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
