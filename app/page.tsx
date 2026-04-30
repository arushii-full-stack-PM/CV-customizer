import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-20 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Powered by AI
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Tailor your CV to <span className="text-blue-500">every job.</span>
        </h1>
        
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          {session 
            ? `Welcome back, ${session.user?.name}! Your workspace is ready.` 
            : "Get shortlisted faster. Connect your Google account to start tailoring your resume with AI."}
        </p>

        {/* WORKSPACE AREA */}
        <div className={`mt-12 transition-all duration-700 ${session ? 'opacity-100 scale-100' : 'opacity-50 scale-95 pointer-events-none grayscale'}`}>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-widest">Analysis Engine</p>
                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Paste Job Description URL..." className="bg-slate-950 border border-slate-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="border-2 border-dashed border-slate-800 rounded-xl py-12 text-slate-500 hover:border-blue-500/50 transition-colors cursor-pointer">
                        Drop your CV here (PDF)
                    </div>
                    <button className={`w-full py-4 rounded-xl font-bold transition-all ${session ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
                        {session ? "Analyze My CV →" : "Sign in to Analyze"}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
