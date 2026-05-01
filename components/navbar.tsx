"use client"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="border-b border-border bg-background h-10 flex items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">CV Customizer</span>
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-text-muted sm:inline-block">{session.user?.name}</span>
              <button onClick={() => signOut()} className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-card transition-colors">Sign out</button>
            </div>
          ) : (
            <button onClick={() => signIn("google")} className="rounded-md bg-primary px-3 py-1 text-xs font-bold text-black hover:brightness-110 transition-all">Sign in</button>
          )}
        </div>
      </div>
    </nav>
  )
}
