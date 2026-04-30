import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-0">
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        <div className="text-center mb-6 w-full">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold uppercase tracking-wider mb-3">
            AI Engine Active
          </div>
          
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-1">
            Tailor your CV to <span className="text-primary">every opportunity.</span>
          </h1>
          
          <p className="text-text-muted text-[10px] sm:text-xs opacity-80">
            {session 
              ? `Welcome back, ${session.user?.name}. Your workspace is ready.` 
              : "Connect your Google account to start tailoring your resume with precision AI analysis."}
          </p>
        </div>

        <div className={`w-full transition-all duration-700 ${session ? 'opacity-100 scale-100' : 'opacity-30 scale-95 pointer-events-none grayscale'}`}>
          <div className="bg-card border border-border rounded-xl p-5 shadow-xl">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-text-subtle mb-1.5 block">Job Description URL</label>
                <input type="text" placeholder="Paste link here..." className="w-full bg-slate-950 border border-border p-2.5 rounded-lg text-xs outline-none" />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-text-subtle mb-1.5 block">Resume Submission</label>
                <div className="border border-dashed border-border rounded-lg py-6 flex flex-col items-center justify-center bg-slate-950/50 cursor-pointer">
                  <svg className="w-5 h-5 text-text-subtle mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-[9px] font-bold text-text-subtle uppercase">Upload PDF Resume</span>
                </div>
              </div>

              <button disabled={!session} className={`w-full py-2.5 rounded-lg font-bold text-xs ${session ? 'bg-primary text-black' : 'bg-disabled-button-bg text-disabled-button-text'}`}>
                {session ? "Analyze Now →" : "Sign in to Analyze"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
