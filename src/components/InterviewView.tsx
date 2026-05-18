import { useState, useEffect } from "react";
import { ChatInterface } from "./chat/ChatInterface";
import { AlertCircle, ChevronLeft, Sparkles, Clock3, Award } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Logo } from "@/src/components/Logo";

const interviewTrackMeta = {
  technical: {
    label: "Technical Interview",
    description: "Practice system-level and coding questions with detailed technical feedback.",
    scoreKeywords: ["react", "node.js", "typescript", "testing", "system design"],
  },
  hr: {
    label: "HR Interview",
    description: "Prepare for behavioral prompts, cultural fit, and storytelling confidence.",
    scoreKeywords: ["communication", "team", "leadership", "collaboration", "stakeholder"],
  },
  "system-design": {
    label: "System Design",
    description: "Build scalable architecture answers that show product thinking and tradeoffs.",
    scoreKeywords: ["system design", "architecture", "scalability", "performance", "latency"],
  },
  coding: {
    label: "Coding Round",
    description: "Sharpen algorithmic problem solving with real-time prompt practice.",
    scoreKeywords: ["algorithm", "data structure", "performance", "testing", "optimization"],
  },
  aptitude: {
    label: "Aptitude Round",
    description: "Train logic, reasoning, and quick decision-making for screening tests.",
    scoreKeywords: ["problem solving", "analytics", "reasoning", "math", "logic"],
  },
};

const interviewQuestions: Record<string, string[]> = {
  technical: [
    "Explain the most complex bug you solved and how you diagnosed it.",
    "Describe a system you built and the architecture decisions behind it.",
    "How do you ensure your code remains testable and maintainable?",
  ],
  hr: [
    "Tell me about a time you handled conflict on a team.",
    "How do you prioritize your work when multiple stakeholders need different outcomes?",
    "Describe a moment when you had to learn something quickly to deliver on a deadline.",
  ],
  "system-design": [
    "Design a scalable messaging platform for millions of users.",
    "How would you architect a low-latency search service?",
    "What tradeoffs do you consider when choosing between SQL and NoSQL?",
  ],
  coding: [
    "How would you reverse a linked list in place?",
    "Explain how you would optimize a slow database query.",
    "What is your approach to solving a problem under time pressure?",
  ],
  aptitude: [
    "How would you solve a logic puzzle where the order matters?",
    "What steps do you take to break down an unfamiliar problem?",
    "Describe any strategies you use for mental math or reasoning tasks.",
  ],
};

function calculateResumeScore(type: string, analysis: any) {
  const skills = Array.isArray(analysis?.skills)
    ? analysis.skills.map((skill: string) => skill.toLowerCase())
    : [];

  const baseScore = {
    technical: 72,
    hr: 68,
    "system-design": 74,
    coding: 75,
    aptitude: 70,
  }[type] ?? 70;

  const keywords = interviewTrackMeta[type as keyof typeof interviewTrackMeta]?.scoreKeywords || [];
  const bonus = keywords.reduce((sum, keyword) => {
    return skills.some((skill) => skill.includes(keyword)) ? sum + 4 : sum;
  }, 0);

  return Math.min(98, baseScore + bonus);
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function InterviewView() {
  const { type } = useParams<{ type?: string }>();
  const [analysis, setAnalysis] = useState<any>(null);
  const [sessionHistory, setSessionHistory] = useState<Message[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("resumeAnalysis");
    if (saved) {
      setAnalysis(JSON.parse(saved));
    }
  }, []);

  const trackKey = type || "technical";
  const trackMeta = interviewTrackMeta[trackKey as keyof typeof interviewTrackMeta] || interviewTrackMeta.technical;
  const questions = interviewQuestions[trackKey] || interviewQuestions.technical;
  const resumeScore = calculateResumeScore(trackKey, analysis);

  const historyEntries = sessionHistory.reduce<Array<{ question: string; answer: string }>>((acc, entry, idx) => {
    if (entry.role !== "user") {
      return acc;
    }

    const nextAssistant = sessionHistory.slice(idx + 1).find((nextEntry) => nextEntry.role === "assistant");
    return [
      ...acc,
      {
        question: entry.content,
        answer: nextAssistant?.content || "",
      },
    ];
  }, []).slice(-5).reverse();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <div>
            <p className="font-semibold text-white text-2xl">{trackMeta.label}</p>
            <p className="text-sm text-text-secondary uppercase tracking-[0.35em]">Practice Track</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/interview" className="text-sm font-semibold text-brand hover:text-white transition-colors">
            ← Back to practice dashboard
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2 text-text-secondary hover:text-white">
              <ChevronLeft className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-bg-sidebar/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand/80">Track Overview</p>
            <h1 className="text-3xl font-bold text-white">{trackMeta.label}</h1>
            <p className="max-w-3xl text-sm leading-7 text-text-secondary">{trackMeta.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">Resume-based score</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="rounded-full bg-brand/10 p-3 text-brand">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">{resumeScore}%</p>
                  <p className="text-xs text-text-secondary uppercase tracking-[0.35em]">Readiness estimate</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">Session signals</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 text-sm text-white">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <span>{questions.length} curated questions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white">
                  <Clock3 className="h-4 w-4 text-brand" />
                  <span>Interactive live practice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-white/10 bg-bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">Suggested question set</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{trackMeta.label} questions</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {questions.map((question, index) => (
                <div key={question} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">Question {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{question}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">Interview history</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Active session log</h2>
              </div>
            </div>
            {historyEntries.length > 0 ? (
              <div className="mt-6 space-y-4">
                {historyEntries.map((entry, index) => (
                  <div key={`${entry.question}-${index}`} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">Your question</p>
                    <p className="mt-2 text-sm text-white">{entry.question}</p>
                    {entry.answer && (
                      <>
                        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-text-secondary">AI answer preview</p>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">{entry.answer}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-text-secondary">
                Your interview history will appear here as you chat with the AI.
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-white/10 bg-bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand/10 p-3 text-brand">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-text-secondary">Practice guidance</p>
                <h2 className="text-xl font-semibold text-white">Track focus</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              {trackMeta.description} Use the question set above to guide your responses, then refine based on the AI feedback.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-bg-card p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">Resume insight</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">What your resume says</h2>
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              {analysis?.analysis || "Your resume analysis will appear here after uploading your CV."}
            </p>
            <div className="mt-6 space-y-3 text-sm text-text-secondary">
              <p><span className="font-semibold text-white">Skills detected:</span> {analysis?.skills?.join(", ") || "—"}</p>
              <p><span className="font-semibold text-white">Top practice recommendation:</span> {questions[0]}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-bg-card p-6">
        <h2 className="text-lg font-semibold text-white">Begin your session</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Use the live chat below to answer interviewer prompts and see your session history update in real time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="lg:col-span-1">
          <ChatInterface context={{ ...(analysis ?? {}), track: trackKey }} onMessagesChange={setSessionHistory} />
        </div>
      </div>
    </div>
  );
}
