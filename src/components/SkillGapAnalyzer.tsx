import React, { useRef, useState } from "react";
import { 
  Upload, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Award,
  Lightbulb,
  ArrowRight,
  FileText,
  Brain,
  Zap
} from "lucide-react";
import { Button } from "./ui/Button";
import { API_BASE_URL, BACKEND_MISSING_MESSAGE } from "@/src/lib/api";

type SkillGapAnalysis = {
  currentSkills: string[];
  missingSkills: string[];
  weakAreas: string[];
  strengthAreas: string[];
  overallScore: number;
  jobMatchScore: number;
  roadmap: RoadmapItem[];
  recommendations: string[];
  estimatedTimeToReady: string;
};

type RoadmapItem = {
  skill: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  resources: Resource[];
  description: string;
};

type Resource = {
  title: string;
  type: "course" | "book" | "practice" | "project";
  url?: string;
  duration?: string;
};

export function SkillGapAnalyzer() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [dreamRole, setDreamRole] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<SkillGapAnalysis | null>(null);
  const [error, setError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>(
    "Upload your resume and enter your dream job role to get started."
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const fetchSkillGapAnalysis = async (url: string, formData: FormData) => {
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
          `Skill gap analysis failed with status ${response.status}. Please retry or check the backend.`
        );
      }
      throw new Error(json?.error || `Skill gap analysis failed with status ${response.status}.`);
    }

    if (parseFailed) {
      throw new Error("Analysis succeeded but returned invalid JSON. Please retry.");
    }

    return json;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!dreamRole.trim()) {
      setError("Please enter your dream job role before uploading.");
      return;
    }

    setFileName(file.name);
    setError("");
    setAnalysisData(null);
    setStatusMessage("Analyzing your skills and generating personalized roadmap...");
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("dreamRole", dreamRole.trim());

    const candidates = [
      `${API_BASE_URL}/api/skill-gap-analysis`,
      "/api/skill-gap-analysis",
    ];

    try {
      let json: any;
      let lastError: any = null;

      for (const url of candidates) {
        try {
          json = await fetchSkillGapAnalysis(url, formData);
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
        currentSkills: Array.isArray(json.currentSkills) ? json.currentSkills : [],
        missingSkills: Array.isArray(json.missingSkills) ? json.missingSkills : [],
        weakAreas: Array.isArray(json.weakAreas) ? json.weakAreas : [],
        strengthAreas: Array.isArray(json.strengthAreas) ? json.strengthAreas : [],
        overallScore: typeof json.overallScore === "number" ? json.overallScore : 0,
        jobMatchScore: typeof json.jobMatchScore === "number" ? json.jobMatchScore : 0,
        roadmap: Array.isArray(json.roadmap) ? json.roadmap : [],
        recommendations: Array.isArray(json.recommendations) ? json.recommendations : [],
        estimatedTimeToReady: typeof json.estimatedTimeToReady === "string" ? json.estimatedTimeToReady : "3-6 months",
      });
      setStatusMessage(`Analysis complete for ${dreamRole} role!`);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to analyze skills. Please ensure the backend server is running and the API is available."
      );
      setStatusMessage("Upload your resume and enter your dream job role to get started.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      default:
        return "bg-white/10 border-white/20 text-white";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "book":
        return <FileText className="h-4 w-4" />;
      case "practice":
        return <Zap className="h-4 w-4" />;
      case "project":
        return <Award className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
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

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-secondary">AI Skill Gap Analyzer</p>
          <h1 className="text-4xl font-bold text-white">Bridge Your Skill Gap</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Upload your resume and specify your dream role. AI will identify missing skills, weak areas, and create a personalized learning roadmap.
          </p>
          {fileName && (
            <p className="mt-3 text-sm text-brand">Selected file: {fileName}</p>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={handleUploadClick} disabled={isAnalyzing}>
          <Upload className="mr-2 h-4 w-4" />
          {isAnalyzing ? "Analyzing..." : "Upload Resume"}
        </Button>
      </div>

      {/* Dream Role Input */}
      <section className="elegant-card space-y-4">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-brand" />
          <h2 className="text-xl font-semibold text-white">Your Dream Job Role</h2>
        </div>
        <p className="text-sm text-text-secondary">
          Enter the specific role you're targeting (e.g., "Senior Full Stack Developer", "Machine Learning Engineer", "DevOps Architect")
        </p>
        <input
          type="text"
          value={dreamRole}
          onChange={(e) => setDreamRole(e.target.value)}
          placeholder="e.g., Senior Full Stack Developer at FAANG"
          className="w-full rounded-xl border border-white/20 bg-white/5 p-4 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
        />
      </section>

      {/* Status Message */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-text-secondary">
        <p className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" />
          {statusMessage}
        </p>
        {error && <p className="mt-2 text-red-400">{error}</p>}
      </div>

      {/* Analysis Results */}
      {analysisData && (
        <>
          {/* Score Overview */}
          <section className="elegant-card space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-white">Readiness Assessment</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ScoreCard
                label="Overall Readiness"
                value={analysisData.overallScore}
                description="Your current preparedness level"
                icon={<Award className="h-5 w-5" />}
              />
              <ScoreCard
                label="Job Match Score"
                value={analysisData.jobMatchScore}
                description="How well you match the role"
                icon={<Target className="h-5 w-5" />}
              />
              <div className="rounded-3xl bg-white/5 p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-2xl bg-brand/10 p-3 text-brand">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Time to Ready</p>
                    <p className="text-2xl font-semibold text-white">{analysisData.estimatedTimeToReady}</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">Estimated learning time</p>
              </div>
            </div>
          </section>

          {/* Skills Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Skills */}
            <section className="elegant-card space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Your Current Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisData.currentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1.5 text-sm font-medium text-green-400"
                  >
                    <CheckCircle2 className="inline h-3 w-3 mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Missing Skills */}
            <section className="elegant-card space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-semibold text-white">Skills to Acquire</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisData.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-sm font-medium text-red-400"
                  >
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Strength and Weak Areas */}
          <div className="grid gap-6 lg:grid-cols-2">
            {analysisData.strengthAreas.length > 0 && (
              <section className="elegant-card bg-green-500/5 border-green-500/10 space-y-4">
                <h3 className="text-lg font-semibold text-green-400">💪 Strength Areas</h3>
                <ul className="space-y-2">
                  {analysisData.strengthAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-text-secondary">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {analysisData.weakAreas.length > 0 && (
              <section className="elegant-card bg-yellow-500/5 border-yellow-500/10 space-y-4">
                <h3 className="text-lg font-semibold text-yellow-400">⚠️ Areas to Improve</h3>
                <ul className="space-y-2">
                  {analysisData.weakAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-text-secondary">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Personalized Roadmap */}
          <section className="elegant-card space-y-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-white">Your Personalized Learning Roadmap</h2>
            </div>
            <p className="text-sm text-text-secondary">
              Follow this step-by-step roadmap to bridge your skill gaps and become job-ready.
            </p>
            <div className="space-y-4">
              {analysisData.roadmap.map((item, index) => (
                <RoadmapCard key={`roadmap-${index}`} item={item} index={index} getPriorityColor={getPriorityColor} getResourceIcon={getResourceIcon} />
              ))}
            </div>
          </section>

          {/* AI Recommendations */}
          {analysisData.recommendations.length > 0 && (
            <section className="elegant-card space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-semibold text-white">AI Recommendations</h2>
              </div>
              <ul className="space-y-3">
                {analysisData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <ArrowRight className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
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

function RoadmapCard({
  item,
  index,
  getPriorityColor,
  getResourceIcon
}: {
  item: RoadmapItem;
  index: number;
  getPriorityColor: (priority: string) => string;
  getResourceIcon: (type: string) => React.ReactNode;
  key?: string;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-6 border border-white/10 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{item.skill}</h3>
            <p className="text-sm text-text-secondary mb-3">{item.description}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className={`rounded-full border px-3 py-1 font-medium ${getPriorityColor(item.priority)}`}>
                {item.priority.toUpperCase()} PRIORITY
              </span>
              <span className="flex items-center gap-1 text-text-muted">
                <Clock className="h-3 w-3" />
                {item.estimatedTime}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {item.resources.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Learning Resources</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {item.resources.map((resource, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-brand">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{resource.title}</p>
                  <p className="text-xs text-text-muted">{resource.type} {resource.duration && `• ${resource.duration}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
