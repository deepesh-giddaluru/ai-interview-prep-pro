import { Link } from "react-router-dom";
import { LayoutDashboard, Slack, Cpu, Code2, Repeat, ShieldCheck } from "lucide-react";

const interviewTypes = [
  {
    key: "technical",
    title: "Technical Interview",
    description: "Practice system-level and coding questions with detailed technical feedback.",
    icon: Cpu,
  },
  {
    key: "hr",
    title: "HR Interview",
    description: "Prepare for behavioral prompts, cultural fit, and storytelling confidence.",
    icon: Slack,
  },
  {
    key: "system-design",
    title: "System Design",
    description: "Build scalable architecture answers that show product thinking and tradeoffs.",
    icon: LayoutDashboard,
  },
  {
    key: "coding",
    title: "Coding Round",
    description: "Sharpen algorithmic problem solving with real-time prompt practice.",
    icon: Code2,
  },
  {
    key: "aptitude",
    title: "Aptitude Round",
    description: "Train logic, reasoning, and quick decision-making for screening tests.",
    icon: ShieldCheck,
  },
];

export function InterviewPracticeDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <section className="rounded-3xl border border-white/10 bg-bg-sidebar/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand/80">Interview Practice</p>
            <h1 className="text-4xl font-bold tracking-tight text-white">Choose your next practice track</h1>
            <p className="max-w-2xl text-base leading-7 text-text-secondary">
              Launch a focused interview session tailored for the exact type of preparation you need. Each track guides you through curated questions and feedback so you can improve fast.
            </p>
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4 text-sm text-text-secondary">
            <p className="font-semibold text-white">How it works</p>
            <ul className="mt-3 space-y-2">
              <li>• Select a practice track</li>
              <li>• Upload your CV once</li>
              <li>• Start the interview engine</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {interviewTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Link
              key={type.key}
              to={`/interview/${type.key}`}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:border-brand/40 hover:bg-brand/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-all group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-text-secondary">
                  Start practice
                </span>
              </div>
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-semibold text-white">{type.title}</h2>
                <p className="text-sm leading-6 text-text-secondary">{type.description}</p>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-bold text-white">What you get</h3>
          <ul className="mt-4 space-y-3 text-sm text-text-secondary">
            <li>• Interview-style prompts with expert AI feedback</li>
            <li>• Resume-aware personalization</li>
            <li>• Practice with both technical and soft-skill scenarios</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-bold text-white">Why practice here</h3>
          <p className="mt-4 text-sm leading-6 text-text-secondary">
            This dashboard is designed around your interview readiness. Each track helps you focus on real-world hiring-round expectations.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-bold text-white">Next step</h3>
          <p className="mt-4 text-sm leading-6 text-text-secondary">
            Pick a track, then answer the AI interviewer prompts. The application will use your resume context to tailor the conversation.
          </p>
        </div>
      </section>
    </div>
  );
}
