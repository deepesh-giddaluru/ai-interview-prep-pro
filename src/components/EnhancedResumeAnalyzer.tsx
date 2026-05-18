import React, { useRef, useState } from "react";
import { FileSearch, ShieldCheck, Upload, Target, AlertCircle, CheckCircle2, TrendingUp, FileText } from "lucide-react";
import { Button } from "./ui/Button";
import { API_BASE_URL, BACKEND_MISSING_MESSAGE } from "@/src/lib/api";

type EnhancedResumeAnalysis = {
  analysis: string;
  suggestedQuestions: string[];
  skills: string[];
  atsScore: number;
  missingKeywords: string[];
  improvements: string[];
  jobMatchScore?: number;
  strengthAreas: string[];
  weaknessAreas: string[];
};

export function EnhancedResumeAnalyzer() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [analysisMessage, setAnalysisMessage] = useState<string>(
    "Upload your resume and optionally add a job description for detailed analysis."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<EnhancedResumeAnalysis | null>(null);
  const [error, setError] = useState<string>("");

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const fetchEnhancedAnalysis = async (url: string, formData: FormData) => {
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
          `Resume analysis failed with status ${response.status}. Please retry or check the backend.`
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
    setAnalysisMessage("Analyzing resume with AI... please wait.");
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", "Software Engineer");
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription.trim());
    }

    const candidates = [
      `${API_BASE_URL}/api/enhanced-resume-analysis`,
      "/api/enhanced-resume-analysis",
    ];

    try {
      let json: any;
      let lastError: any = null;

      for (const url of candidates) {
        try {
          json = await fetchEnhancedAnalysis(url, formData);
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
        throw new Error(lastError?.message || BACKEND_MISSING_MESSAGE);
      }

      setAnalysisData({
        analysis: typeof json.analysis === "string" ? json.analysis : "No analysis available.",
        suggestedQuestions: Array.isArray(json.suggestedQuestions) ? json.suggestedQuestions : [],
        skills: Array.isArray(json.skills) ? json.skills : [],
        atsScore: typeof json.atsScore === "number" ? json.atsScore : 75,
        missingKeywords: Array.isArray(json.missingKeywords) ? json.missingKeywords : [],
        improvements: Array.isArray(json.improvements) ? json.improvements : [],
        jobMatchScore: typeof json.jobMatchScore === "number" ? json.jobMatchScore : undefined,
        strengthAreas: Array.isArray(json.strengthAreas) ? json.strengthAreas : [],
        weaknessAreas: Array.isArray(json.weaknessAreas) ? json.weaknessAreas : [],
      });
      setAnalysisMessage(`Resume ${file.name} analyzed successfully with AI.`);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to analyze resume. Please ensure the backend server is running and the API is available."
      );
      setAnalysisMessage("Upload a resume to generate comprehensive analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <input
        type="file"
        accept="application/pdf,.doc,.docx"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-secondary">AI Resume Analyzer</p>
          <h1 className="text-4xl font-bold text-white">Optimize Your Resume</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Upload your resume and get AI-powered insights including ATS score, missing keywords, and job match analysis.
          </p>
          {fileName && (
            <p className="mt-3 text-sm text-brand">Selected file: {fileName}</p>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={handleScanClick} disabled={isAnalyzing}>
          <Upload className="mr-2 h-4 w-4" />
          {isAnalyzing ? "Analyzing..." : "Upload Resume"}
        </Button>
      </div>

      {/* Job Description Input */}
      <section className="elegant-card space-y-4">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-brand" />
          <h2 className="text-xl font-semibold text-white">Job Description (Optional)</h2>
        </div>
        <p className="text-sm text-text-secondary">
          Paste the job description to get a match score and identify missing keywords.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here for better analysis..."
          className="w-full min-h-[120px] rounded-xl border border-white/20 bg-white/5 p-4 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-y"
        />
      </section>

      {/* Score Overview */}
      {analysisData && (
        <section className="elegant-card space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <h2 className="text-xl font-semibold text-white">Analysis Scores</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ScoreCard
              label="ATS Score"
              value={analysisData.atsScore}
              description="Applicant Tracking System compatibility"
              icon={<FileSearch className="h-5 w-5" />}
            />
            {analysisData.jobMatchScore !== undefined && (
              <ScoreCard
                label="Job Match"
                value={analysisData.jobMatchScore}
                description="Resume vs Job Description alignment"
                icon={<Target className="h-5 w-5" />}
              />
            )}
            <ScoreCard
              label="Overall Quality"
              value={Math.round((analysisData.atsScore + (analysisData.jobMatchScore || analysisData.atsScore)) / 2)}
              description="Combined resume quality score"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>
        </section>
      )}

      {/* Analysis Report */}
      <section className="elegant-card space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-text-secondary uppercase tracking-[0.3em]">AI Analysis Report</p>
            <p className="mt-2 text-sm text-text-muted">{analysisMessage}</p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-text-secondary">
          {analysisData ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                <p className="text-white leading-relaxed">{analysisData.analysis}</p>
              </div>

              {analysisData.skills.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] text-text-secondary mb-3">Detected Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-medium text-green-400"
                      >
                        <CheckCircle2 className="inline h-3 w-3 mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysisData.missingKeywords.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] text-text-secondary mb-3">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.missingKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-medium text-red-400"
                      >
                        <AlertCircle className="inline h-3 w-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysisData.improvements.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] text-text-secondary mb-3">Improvement Suggestions</h3>
                  <ul className="space-y-2">
                    {analysisData.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 text-white">
                        <TrendingUp className="h-4 w-4 text-brand mt-1 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {analysisData.strengthAreas.length > 0 && (
                  <div className="rounded-2xl bg-green-500/5 border border-green-500/10 p-4">
                    <h3 className="text-sm font-semibold text-green-400 mb-2">Strength Areas</h3>
                    <ul className="space-y-1 text-sm text-text-secondary">
                      {analysisData.strengthAreas.map((area, index) => (
                        <li key={index}>• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisData.weaknessAreas.length > 0 && (
                  <div className="rounded-2xl bg-red-500/5 border border-red-500/10 p-4">
                    <h3 className="text-sm font-semibold text-red-400 mb-2">Areas to Improve</h3>
                    <ul className="space-y-1 text-sm text-text-secondary">
                      {analysisData.weaknessAreas.map((area, index) => (
                        <li key={index}>• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {analysisData.suggestedQuestions.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] text-text-secondary mb-3">Suggested Interview Questions</h3>
                  <ul className="space-y-2">
                    {analysisData.suggestedQuestions.map((question, index) => (
                      <li key={index} className="flex items-start gap-2 text-white">
                        <FileText className="h-4 w-4 text-brand mt-1 flex-shrink-0" />
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>{analysisMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ScoreCard({ label, value, description, icon }: { label: string; value: number; description: string; icon: React.ReactNode }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  return (
    <div className="rounded-3xl bg-white/5 p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-2xl bg-brand/10 p-3 text-brand">
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{label}</p>
          <p className={`text-3xl font-semibold ${getScoreColor(value)}`}>{value}%</p>
        </div>
      </div>
      <p className="text-xs text-text-secondary">{description}</p>
      <div className="mt-3">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${value >= 80 ? 'bg-green-400' : value >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">{getScoreLabel(value)}</p>
      </div>
    </div>
  );
}

// Made with Bob
