import React, { useRef, useState } from "react";
import { FileSearch, ShieldCheck } from "lucide-react";
import { Button } from "./ui/Button";
import { API_BASE_URL, BACKEND_MISSING_MESSAGE } from "@/src/lib/api";

type ResumeAnalysisResult = {
  analysis: string;
  suggestedQuestions: string[];
  skills: string[];
};

export function ResumeAnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [analysisMessage, setAnalysisMessage] = useState<string>(
    "Upload a resume to generate a performance breakdown, impact score, and improvement checklist."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const fetchResumeAnalysis = async (url: string, formData: FormData) => {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    let json: any;
    let parseFailed = false;

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = {};
      parseFailed = true;
    }

    if (!response.ok) {
      if (parseFailed) {
        throw new Error(
          `Resume analysis failed with status ${response.status} and returned a non-JSON error. Please retry or check the backend.`
        );
      }
      throw new Error(json?.error || `Resume analysis failed with status ${response.status}.`);
    }

    if (parseFailed) {
      throw new Error("Resume analysis succeeded but returned invalid JSON. Please retry.");
    }

    return json;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    setAnalysisData(null);
    setAnalysisMessage("Analyzing resume... please wait.");
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", "Software Engineer");

    const candidates = [
      `${API_BASE_URL}/api/analyze-resume`,
      "/api/analyze-resume",
    ];

    try {
      let json: any;
      let lastError: any = null;

      for (const url of candidates) {
        try {
          json = await fetchResumeAnalysis(url, formData);
          lastError = null;
          break;
        } catch (fetchError: any) {
          lastError = fetchError;
          if (fetchError.message?.includes("status 404")) {
            continue;
          }
          if (fetchError.message?.includes("Failed to fetch") || fetchError.message?.includes("NetworkError")) {
            continue;
          }
          throw fetchError;
        }
      }

      if (!json) {
        throw new Error(
          lastError?.message || BACKEND_MISSING_MESSAGE
        );
      }

      setAnalysisData({
        analysis: typeof json.analysis === "string" ? json.analysis : "No analysis available.",
        suggestedQuestions: Array.isArray(json.suggestedQuestions) ? json.suggestedQuestions : [],
        skills: Array.isArray(json.skills) ? json.skills : [],
      });
      setAnalysisMessage(`Resume ${file.name} scanned successfully.`);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to scan resume. Please ensure the backend server is running and the API is available."
      );
      setAnalysisMessage("Upload a resume to generate a performance breakdown, impact score, and improvement checklist.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-secondary">Resume Analyzer</p>
          <h1 className="text-4xl font-bold text-white">Optimize your CV</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Upload your resume and get AI-powered guidance to improve recruiter-fit and interview readiness.
          </p>
          {fileName ? (
            <p className="mt-3 text-sm text-text-muted">Selected file: {fileName}</p>
          ) : null}
        </div>
        <Button variant="secondary" size="sm" onClick={handleScanClick}>
          <FileSearch className="mr-2 h-4 w-4" />
          {isAnalyzing ? "Scanning..." : "Scan Resume"}
        </Button>
      </div>

      <section className="elegant-card space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-brand" />
          <h2 className="text-xl font-semibold text-white">Resume health</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label="Format" value="Excellent" />
          <ResultCard label="Keywords" value="Strong" />
          <ResultCard label="ATS Friendly" value="High" />
        </div>
      </section>

      <section className="elegant-card space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-text-secondary uppercase tracking-[0.3em]">Analysis report</p>
            <p className="mt-2 text-sm text-text-muted">{analysisMessage}</p>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-text-secondary">
          {analysisData ? (
            <>
              <p className="text-white leading-relaxed">{analysisData.analysis}</p>
              {analysisData.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Detected skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysisData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysisData.suggestedQuestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Suggested questions</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text-secondary">
                    {analysisData.suggestedQuestions.map((question, index) => (
                      <li key={index} className="text-white">
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p>{analysisMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
