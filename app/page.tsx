import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Minimalist Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            AI Engine Active
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Optimize your <span className="text-primary">Career Path.</span>
          </h1>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            {session 
              ? `Ready for your next move, ${session.user?.name?.split(' ')[0]}?` 
              : "Professional CV analysis and job matching tool."}
          </p>
        </div>

        {/* Workspace Card - No Scroll Needed */}
        <div className={`w-full transition-all duration-500 ${session ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-primary/5">
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-subtle mb-2 block">Job Description</label>
                <input 
                  type="text" 
                  placeholder="Paste URL or Role Title..." 
                  className="w-full bg-background border border-border p-3 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none transition-all" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-subtle mb-2 block">Resume Upload</label>
                <div className="border border-dashed border-border rounded-lg py-10 flex flex-col items-center justify-center bg-background/50 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group">
                  <svg className="w-6 h-6 text-text-subtle group-hover:text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-xs text-text-subtle">Upload PDF (Max 5MB)</span>
                </div>
              </div>

              <button className="w-full py-3 bg-primary text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                {session ? "Run Comparison Analysis" : "Sign in to Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
