import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        {/* Condensed 1-Line Header Section */}
        <div className="text-center mb-8 w-full">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-wider mb-4">
            AI Engine Active
          </div>
          
          {/* Heading: Forced to 1 line */}
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2 whitespace-nowrap">
            Tailor your CV to <span className="text-primary">every opportunity.</span>
          </h1>
          
          {/* Subheading: Forced to 1 line */}
          <p className="text-text-muted text-[11px] sm:text-xs truncate w-full max-w-2xl mx-auto">
            {session 
              ? `Welcome back, ${session.user?.name}. Your AI-powered workspace is ready for analysis.` 
              : "Connect your Google account to start tailoring your resume with precision AI analysis."}
          </p>
        </div>

        {/* Workspace Card */}
        <div className={`w-full transition-all duration-700 ${session ? 'opacity-100 scale-100' : 'opacity-30 scale-95 pointer-events-none grayscale'}`}>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-indigo-950/20">
            <div className="flex flex-col gap-5">
              
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-text-subtle mb-2 block">Job Description URL</label>
                <input 
                  type="text" 
                  placeholder="Paste the link to the job posting..." 
                  className="w-full bg-slate-950 border border-border p-3 rounded-xl text-xs focus:ring-1 focus:ring-primary outline-none transition-all" 
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-text-subtle mb-2 block">Resume Submission</label>
                <div className="border border-dashed border-border rounded-xl py-8 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group">
                  <svg className="w-6 h-6 text-text-subtle group-hover:text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-[10px] font-medium text-text-subtle uppercase tracking-wide">Upload PDF Resume</span>
                </div>
              </div>

              <button 
                disabled={!session}
                className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all shadow-xl ${
                  session 
                  ? 'bg-primary text-black hover:brightness-110 shadow-indigo-500/15' 
                  : 'bg-disabled-button-bg text-disabled-button-text'
                }`}
              >
                {session ? "Run Comparison Analysis →" : "Sign in to Analyze"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
