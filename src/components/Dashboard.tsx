import { useState } from "react";
import { motion } from "motion/react";
import { Upload, FileText, Play, History, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/src/components/Logo";
import { API_BASE_URL, BACKEND_MISSING_MESSAGE } from "@/src/lib/api";

export function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [role, setRole] = useState("Software Engineer");
  const [uploadError, setUploadError] = useState<string>("");
  const [backendWarning, setBackendWarning] = useState<string>("");
  const navigate = useNavigate();

  const parseJsonResponse = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { error: text || `Unexpected backend response (${response.status})` };
    }
  };

  const attemptUpload = async (url: string, formData: FormData) => {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(data?.error || `Resume upload failed with status ${response.status}.`);
    }
    return data;
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    const endpoints = [
      `${API_BASE_URL}/api/analyze-resume`,
      "/api/analyze-resume",
    ];

    try {
      let data: any = null;
      let lastError: any = null;

      for (const endpoint of endpoints) {
        try {
          data = await attemptUpload(endpoint, formData);
          lastError = null;
          break;
        } catch (error: any) {
          lastError = error;
          if (
            error?.message?.includes("404") ||
            error?.message?.includes("Failed to fetch") ||
            error?.message?.includes("NetworkError")
          ) {
            continue;
          }
          throw error;
        }
      }

      if (!data) {
        throw new Error(
          lastError?.message ||
          BACKEND_MISSING_MESSAGE
        );
      }

      localStorage.setItem("resumeAnalysis", JSON.stringify(data));
      navigate("/interview");
    } catch (error: any) {
      console.error("Upload error:", error);
      const message = error?.message || "Failed to upload resume. Please try again.";
      setUploadError(message);
      ) {
        setBackendWarning(BACKEND_MISSING_MESSAGE);
      } else {
        setBackendWarning("");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header with Logo */}
      <header className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Logo size={40} />
          <span className="text-2xl font-bold text-white">Deepesh's Interview App</span>
        </Link>
      </header>

      <header>
        <h1 className="text-4xl font-bold text-white tracking-tight">Main Dashboard</h1>
        <p className="text-text-secondary mt-1">Refine your skills against adversarial AI models.</p>
      </header>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-text-secondary">
        <p className="font-semibold text-white">Local backend configuration</p>
        <p>
          Use <span className="font-medium">{API_BASE_URL}</span> for API requests. Ensure you start the backend with <span className="font-medium">npm run dev</span> and open the app on the same host.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <section className="lg:col-span-2 elegant-card border-brand/20 bg-brand/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand/20 border border-brand/30">
              <Upload className="h-5 w-5 text-brand" />
            </div>
            <h2 className="text-xl font-bold text-white">Initialize New Session</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Target Designation</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-bg-main p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                placeholder="e.g. Lead Systems Architect"
              />
            </div>

            <div 
              className="group border-2 border-dashed border-white/10 rounded-2xl p-16 text-center hover:border-brand/50 hover:bg-white/[0.02] transition-all cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile?.type === "application/pdf") {
                  setFile(droppedFile);
                }
              }}
            >
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-10 w-10 text-brand opacity-60" />
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="text-base font-bold text-white">{file.name}</p>
                    <p className="text-xs text-brand font-medium">Ready for semantic analysis</p>
                  </div>
                ) : (
                  <>
                    <p className="text-base font-bold text-white">Import Professional CV</p>
                    <p className="text-xs text-text-muted mt-2">PDF Architecture Map (max 5MB)</p>
                  </>
                )}
              </label>
            </div>
            
            <Button 
              size="lg"
              className="w-full" 
              disabled={!file || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "Processing Semantic Data..." : "Finalize & Launch Interview"}
              {!isUploading && <Play className="ml-2 h-4 w-4" />}
            </Button>
            {uploadError ? (
              <p className="mt-3 text-sm text-red-400">{uploadError}</p>
            ) : null}
            {backendWarning ? (
              <div className="mt-4 flex gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                <AlertCircle className="mt-1 h-5 w-5 text-red-300" />
                <div>
                  <p className="font-semibold">Backend host missing</p>
                  <p>{backendWarning}</p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Stats Column */}
        <div className="space-y-8">
          <section className="elegant-card bg-white/[0.02] border-white/10 p-8">
            <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-brand" />
              Readiness Index
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-bold tracking-tighter">84</p>
                <p className="text-sm font-bold text-brand uppercase tracking-widest">Percentile</p>
              </div>
              
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  className="h-full bg-brand shadow-[0_0_12px_rgba(79,70,229,0.5)]" 
                />
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs font-medium text-text-muted">
                <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span>Completed Sessions</span>
                  <span className="text-white font-bold">12</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span>Questions Faced</span>
                  <span className="text-white font-bold">128</span>
                </div>
              </div>
            </div>
          </section>

          <section className="elegant-card bg-brand border-none shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
            <h3 className="font-bold text-white mb-2">Upgrade to Expert</h3>
            <p className="text-sm text-indigo-100 opacity-90 leading-relaxed">
              Unlock expert AI coaching and unlimited technical deep-dive sessions.
            </p>
            <button className="mt-4 w-full bg-white text-brand font-bold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors">
              Access Expert Mode
            </button>
          </section>
        </div>
      </div>

      {/* History Table */}
      <section className="space-y-6">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest flex items-center gap-3">
          <History className="h-4 w-4" />
          Archive of Intelligence
        </h2>
        <div className="elegant-card bg-white/[0.01] border-white/5 divide-y divide-white/5 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group p-6 flex items-center justify-between hover:bg-white/[0.03] transition-all cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand/10 group-hover:border-brand/20 transition-all">
                  <FileText className="h-6 w-6 text-text-secondary group-hover:text-brand transition-colors" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Advanced React Architect</p>
                  <p className="text-xs text-text-muted font-medium mt-1">Archive ID • 2026.05.{12-i}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{(9.2 - i*0.3).toFixed(1)}</p>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Metric</p>
                </div>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Inspect Data</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 22V18" />
      <path d="M14 22V18" />
      <path d="M12 18a8 8 0 0 1-8-8V4h16v6a8 8 0 0 1-8 8Z" />
    </svg>
  );
}
