import { motion } from "motion/react";
import { ArrowRight, CheckCircle, FileText, Bot, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Logo } from "@/src/components/Logo";

export function LandingPage() {
  return (
    <div className="flex flex-col bg-bg-main min-h-screen text-text-primary selection:bg-brand/30">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-main/80 backdrop-blur-md border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center gap-3">
          <Logo size={36} />
          <span className="text-xl font-bold text-white">Deepesh's Interview App</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent_50%)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-8"
            >
              Master Your Next <br />
              <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">Interview Strategy</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg leading-relaxed text-text-secondary max-w-2xl mx-auto"
            >
              Bridge the gap between your resume and a job offer. Conduct hyper-realistic sessions with an AI that knows your strengths better than you do.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto gap-2 px-10">
                  Begin Free Session <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features" className="text-sm font-semibold leading-6 text-text-secondary hover:text-white transition-colors">
                Explore platform mechanics <span aria-hidden="true" className="ml-1">↓</span>
              </a>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand/20 to-transparent blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 border-t border-border-subtle bg-bg-sidebar/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-sm font-bold leading-7 text-brand uppercase tracking-widest">Platform Core</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Engineered for candidates.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: "Semantic Parsing",
                  description: "The app analyzes not just keywords, but the semantic weight of your achievements to find real leverage points.",
                  icon: FileText,
                },
                {
                  name: "Adversarial Training",
                  description: "The AI interviewer adapts to your hesitation, pushing you slightly outside your comfort zone to build resilience.",
                  icon: Bot,
                },
                {
                  name: "Quantifiable Feedback",
                  description: "Every answer is scored against industry-standard rubrics, giving you a clear growth trajectory.",
                  icon: Trophy,
                },
              ].map((feature) => (
                <div key={feature.name} className="elegant-card hover:border-brand/30 transition-colors group">
                  <dt className="flex items-center gap-x-4 text-base font-bold leading-7 text-white">
                    <div className="p-2 rounded-lg bg-brand/10 border border-brand/20 text-brand group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-sm leading-relaxed text-text-secondary">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
