import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Target,
  BookOpen,
  Award,
  Code,
  TrendingUp,
  Calendar,
  Download,
  Sun,
  Moon,
  Loader2,
  CheckCircle2,
  Youtube,
  DollarSign,
  Briefcase,
  Clock,
  Zap,
  Star,
  ArrowRight,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";

interface RoadmapData {
  career: string;
  level: string;
  timeframe: string;
  monthlyPlan: Array<{
    month: number;
    title: string;
    focus: string[];
    milestones: string[];
  }>;
  skills: Array<{
    name: string;
    category: string;
    priority: string;
    progress: number;
  }>;
  projects: Array<{
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    technologies: string[];
  }>;
  certifications: Array<{
    name: string;
    provider: string;
    cost: string;
    duration: string;
    priority: string;
  }>;
  interviewTopics: string[];
  dailyPractice: {
    coding: string;
    reading: string;
    projects: string;
    networking: string;
  };
  courses: Array<{
    title: string;
    platform: string;
    rating: number;
    duration: string;
    link: string;
  }>;
  youtubeVideos: Array<{
    title: string;
    channel: string;
    duration: string;
    topic: string;
  }>;
  salaryInsights: {
    entry: string;
    mid: string;
    senior: string;
    location: string;
  };
  jobRoles: string[];
}

export function CareerRoadmapGenerator() {
  const [careerGoal, setCareerGoal] = useState("");
  const [currentLevel, setCurrentLevel] = useState("Beginner");
  const [timeframe, setTimeframe] = useState("6 Months");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const careerExamples = [
    "Full Stack Developer",
    "AI Engineer",
    "DevOps Engineer",
    "Data Scientist",
    "Mobile App Developer",
    "Cloud Architect",
  ];

  const generateFallbackRoadmap = (): RoadmapData => {
    const months = timeframe === "3 Months" ? 3 : timeframe === "6 Months" ? 6 : 12;

    return {
      career: careerGoal,
      level: currentLevel,
      timeframe: timeframe,
      monthlyPlan: Array.from({ length: months }, (_, i) => ({
        month: i + 1,
        title: `Month ${i + 1}: ${
          ["Foundation", "Core Skills", "Advanced Topics", "Specialization", "Projects", "Interview Prep"][i % 6]
        }`,
        focus: [
          "Master fundamental concepts",
          "Build practical projects",
          "Learn industry best practices",
        ],
        milestones: [
          "Complete 2-3 online courses",
          "Build 1 portfolio project",
          "Contribute to open source",
        ],
      })),
      skills: [
        { name: "JavaScript/TypeScript", category: "Programming", priority: "High", progress: 0 },
        { name: "React/Next.js", category: "Frontend", priority: "High", progress: 0 },
        { name: "Node.js/Express", category: "Backend", priority: "High", progress: 0 },
        { name: "Database (SQL/NoSQL)", category: "Database", priority: "High", progress: 0 },
        { name: "Git & GitHub", category: "Tools", priority: "High", progress: 0 },
        { name: "Docker & Kubernetes", category: "DevOps", priority: "Medium", progress: 0 },
        { name: "AWS/Azure/GCP", category: "Cloud", priority: "Medium", progress: 0 },
        { name: "Testing (Jest/Cypress)", category: "Testing", priority: "Medium", progress: 0 },
      ],
      projects: [
        {
          title: "E-commerce Platform",
          description: "Build a full-stack e-commerce application with payment integration",
          difficulty: "Intermediate",
          duration: "4-6 weeks",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        },
        {
          title: "Real-time Chat Application",
          description: "Create a chat app with WebSocket support and user authentication",
          difficulty: "Intermediate",
          duration: "3-4 weeks",
          technologies: ["React", "Socket.io", "Express", "PostgreSQL"],
        },
        {
          title: "Task Management System",
          description: "Develop a project management tool with team collaboration features",
          difficulty: "Advanced",
          duration: "6-8 weeks",
          technologies: ["Next.js", "Prisma", "PostgreSQL", "Redis"],
        },
      ],
      certifications: [
        {
          name: "AWS Certified Developer",
          provider: "Amazon",
          cost: "$150",
          duration: "3 months",
          priority: "High",
        },
        {
          name: "Professional Scrum Master",
          provider: "Scrum.org",
          cost: "$200",
          duration: "2 months",
          priority: "Medium",
        },
        {
          name: "Google Cloud Professional",
          provider: "Google",
          cost: "$200",
          duration: "3 months",
          priority: "Medium",
        },
      ],
      interviewTopics: [
        "Data Structures & Algorithms",
        "System Design Fundamentals",
        "Database Design & Optimization",
        "API Design & RESTful Services",
        "Authentication & Security",
        "Testing Strategies",
        "CI/CD Pipelines",
        "Cloud Architecture",
      ],
      dailyPractice: {
        coding: "2-3 hours of coding practice on LeetCode/HackerRank",
        reading: "1 hour reading technical blogs and documentation",
        projects: "2-3 hours working on personal projects",
        networking: "30 minutes engaging with tech communities",
      },
      courses: [
        {
          title: "Complete Web Development Bootcamp",
          platform: "Udemy",
          rating: 4.8,
          duration: "60 hours",
          link: "#",
        },
        {
          title: "Advanced React Patterns",
          platform: "Frontend Masters",
          rating: 4.9,
          duration: "8 hours",
          link: "#",
        },
        {
          title: "Node.js Microservices",
          platform: "Pluralsight",
          rating: 4.7,
          duration: "12 hours",
          link: "#",
        },
        {
          title: "AWS Solutions Architect",
          platform: "A Cloud Guru",
          rating: 4.8,
          duration: "40 hours",
          link: "#",
        },
      ],
      youtubeVideos: [
        {
          title: "Full Stack Development Roadmap 2024",
          channel: "Traversy Media",
          duration: "45 min",
          topic: "Career Guide",
        },
        {
          title: "React Best Practices",
          channel: "Web Dev Simplified",
          duration: "30 min",
          topic: "Frontend",
        },
        {
          title: "System Design Interview Prep",
          channel: "Tech Dummies",
          duration: "60 min",
          topic: "Interviews",
        },
        {
          title: "Docker & Kubernetes Tutorial",
          channel: "TechWorld with Nana",
          duration: "90 min",
          topic: "DevOps",
        },
      ],
      salaryInsights: {
        entry: "$60,000 - $80,000",
        mid: "$90,000 - $120,000",
        senior: "$130,000 - $180,000+",
        location: "United States (Average)",
      },
      jobRoles: [
        "Junior Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Engineer",
        "Software Engineer",
        "Web Application Developer",
      ],
    };
  };

  const generateRoadmap = async () => {
    if (!careerGoal.trim()) {
      setError("Please enter your career goal");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setIsGenerating(true);
    setError("");
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career: careerGoal,
          level: currentLevel,
          timeframe: timeframe,
        }),
      });
      if (!response.ok) throw new Error("Failed to generate roadmap");
      const data = await response.json();
      setRoadmapData(data.roadmap);
    } catch (err) {
      console.error("Error generating roadmap:", err);
      setRoadmapData(generateFallbackRoadmap());
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!roadmapData) return;
    const doc = new jsPDF();
    let yPos = 20;
    doc.setFontSize(20);
    doc.text(`Career Roadmap: ${roadmapData.career}`, 20, yPos);
    yPos += 15;
    doc.setFontSize(12);
    doc.text(`Level: ${roadmapData.level} | Timeframe: ${roadmapData.timeframe}`, 20, yPos);
    yPos += 15;
    doc.setFontSize(16);
    doc.text("Monthly Learning Plan", 20, yPos);
    yPos += 10;
    roadmapData.monthlyPlan.forEach((month) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.text(`${month.title}`, 20, yPos);
      yPos += 7;
    });
    doc.save(`${roadmapData.career.replace(/\s+/g, "-")}-roadmap.pdf`);
  };

  const updateSkillProgress = (index: number, progress: number) => {
    if (!roadmapData) return;
    const updatedSkills = [...roadmapData.skills];
    updatedSkills[index].progress = progress;
    setRoadmapData({ ...roadmapData, skills: updatedSkills });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#0A0A0B]" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1
              className={`text-4xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              AI Career Roadmap Generator
            </h1>
          </div>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Get a personalized learning path powered by AI
          </p>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`mt-4 p-3 rounded-xl ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-all duration-300`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${
            isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          } backdrop-blur-xl border rounded-3xl p-8 mb-8 shadow-2xl`}
        >
          <div className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                What do you want to become?
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g., Full Stack Developer, AI Engineer, DevOps Engineer"
                className={`w-full px-6 py-4 rounded-xl ${
                  isDarkMode
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                } border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {careerExamples.map((example) => (
                  <button
                    key={example}
                    onClick={() => setCareerGoal(example)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      isDarkMode
                        ? "bg-white/5 hover:bg-white/10 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    } transition-all`}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Current Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className={`w-full px-6 py-4 rounded-xl ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border focus:ring-2 focus:ring-purple-500 transition-all`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className={`w-full px-6 py-4 rounded-xl ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border focus:ring-2 focus:ring-purple-500 transition-all`}
                >
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateRoadmap}
              disabled={isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Generate Roadmap
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {roadmapData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div className="flex justify-end">
                <button
                  onClick={downloadPDF}
                  className={`px-6 py-3 rounded-xl ${
                    isDarkMode
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  } flex items-center gap-2 transition-all`}
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
                } backdrop-blur-xl border rounded-3xl p-8`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Calendar className="w-6 h-6 text-purple-500" />
                  Monthly Learning Plan
                </h2>
                <div className="space-y-6">
                  {roadmapData.monthlyPlan.map((month, index) => (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${
                        isDarkMode
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-200"
                      } border rounded-2xl p-6 hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {month.month}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold mb-2 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {month.title}
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p
                                className={`text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Focus Areas:
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                {month.focus.map((item, i) => (
                                  <li
                                    key={i}
                                    className={`text-sm ${
                                      isDarkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Milestones:
                              </p>
                              <ul className="space-y-1">
                                {month.milestones.map((milestone, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span
                                      className={`text-sm ${
                                        isDarkMode ? "text-gray-300" : "text-gray-700"
                                      }`}
                                    >
                                      {milestone}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
                } backdrop-blur-xl border rounded-3xl p-8`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                  Skills Progress Tracker
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmapData.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        isDarkMode
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-200"
                      } border rounded-xl p-4`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3
                            className={`font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {skill.name}
                          </h3>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {skill.category}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            skill.priority === "High"
                              ? "bg-red-500/20 text-red-400"
                              : skill.priority === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {skill.priority}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div
                          className={`h-2 ${
                            isDarkMode ? "bg-white/10" : "bg-gray-200"
                          } rounded-full overflow-hidden`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.progress}
                          onChange={(e) =>
                            updateSkillProgress(index, parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                        <p
                          className={`text-xs text-right ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {skill.progress}% Complete
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}