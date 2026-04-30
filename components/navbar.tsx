"use server"

import { auth, signIn, signOut } from "@/auth"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#0f172a] border-b border-slate-800">
      {/* Left side: Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="font-bold text-xl text-white tracking-tight">CV Customizer</span>
      </div>

      {/* Right side: Auth State */}
      <div className="flex items-center gap-4">
        {session?.user ? (
          <div className="flex items-center gap-3 bg-slate-800/50 p-1 pr-3 rounded-full border border-slate-700">
            <img 
              src={session.user.image || ""} 
              alt="User" 
              className="w-8 h-8 rounded-full border border-blue-500"
            />
            <span className="text-sm font-medium text-slate-200 hidden sm:inline-block">
              {session.user.name?.split(' ')[0]}
            </span>
            <form action={async () => { "use server"; await signOut(); }}>
              <button type="submit" className="text-xs text-slate-400 hover:text-white transition-colors px-2">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form action={async () => { "use server"; await signIn("google"); }}>
            <button type="submit" className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  )
}
