import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

type ChatHistoryItem = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

type ResumeAnalysisResult = {
  analysis: string;
  suggestedQuestions: string[];
  skills: string[];
};

type EvaluationResult = {
  score: number;
  feedback: string;
  correctPoints: string[];
  improvementAreas: string[];
};

let geminiClient: GoogleGenAI | null = null;
let openaiClient: OpenAI | null = null;

type AIProvider = "gemini" | "openai";

function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return "openai";
  }
  return "gemini";
}

function getGeminiClient() {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  return geminiClient;
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey,
    });
  }

  return openaiClient;
}

function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function mockResumeAnalysis(role: string): ResumeAnalysisResult {
  return {
    analysis:
      "Strong technical profile with clear implementation experience. Improve impact storytelling with measurable outcomes and ownership metrics.",
    suggestedQuestions: [
      `Tell me about a difficult ${role || "software"} problem you solved end-to-end.`,
      "How do you debug a production issue under time pressure?",
      "How do you prioritize tradeoffs between speed and code quality?",
      "Describe a project where collaboration changed the technical direction.",
      "What would you improve in your most recent architecture decision?",
    ],
    skills: ["React", "Node.js", "TypeScript", "System Design", "Testing"],
  };
}

export async function analyzeResume(input: {
  role?: string;
  fileName?: string;
  fileSize?: number;
}): Promise<ResumeAnalysisResult> {
  const role = input.role?.trim() || "Software Engineer";
  const provider = getAIProvider();

  if (provider === "openai") {
    const openai = getOpenAIClient();
    if (!openai) {
      return mockResumeAnalysis(role);
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert resume analyzer. Return only valid JSON.",
          },
          {
            role: "user",
            content: `Analyze this candidate profile for a ${role} interview track.\nResume metadata: file=${input.fileName || "uploaded.pdf"}, sizeBytes=${input.fileSize || 0}.\nReturn strictly JSON: {"analysis":"...","suggestedQuestions":["..."],"skills":["..."]}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return safeJsonParse(content, mockResumeAnalysis(role));
    } catch (error) {
      console.error("OpenAI resume analysis error:", error);
      return mockResumeAnalysis(role);
    }
  }

  // Gemini provider
  const gemini = getGeminiClient();
  if (!gemini) {
    return mockResumeAnalysis(role);
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this candidate profile for a ${role} interview track.\nResume metadata: file=${input.fileName || "uploaded.pdf"}, sizeBytes=${input.fileSize || 0}.\nReturn strictly JSON: {"analysis":"...","suggestedQuestions":["..."],"skills":["..."]}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    return safeJsonParse(response.text, mockResumeAnalysis(role));
  } catch (error) {
    console.error("Gemini resume analysis error:", error);
    return mockResumeAnalysis(role);
  }
}

const mockMarketQuestions: Record<string, string[]> = {
  technical: [
    "At Google, how would you design a highly available search query service for millions of users?",
    "At Amazon, describe your approach to building a scalable order processing pipeline that handles peak traffic.",
    "At Microsoft, how would you architect a cross-region collaborative editing service with low latency?",
  ],
  hr: [
    "At Meta, tell me about a time you persuaded a team to change direction and how you managed stakeholder feedback.",
    "At Apple, describe how you remain calm and productive when priorities change quickly.",
    "At Salesforce, explain how you measure success when delivering a customer-facing product feature.",
  ],
  "system-design": [
    "At Netflix, how would you design a globally distributed video recommendation engine?",
    "At Uber, explain how you would build a low-latency ride-dispatch system across cities.",
    "At LinkedIn, how would you architect a system to serve millions of personalized notifications?",
  ],
  coding: [
    "At Google, how would you optimize a high-performance sorting algorithm for large datasets?",
    "At Facebook, describe the most efficient way to handle millions of concurrent user requests in a service.",
    "At Amazon, how would you implement fault-tolerant retry logic for distributed worker jobs?",
  ],
  aptitude: [
    "At Apple, how would you break down a new product problem and define success criteria quickly?",
    "At Microsoft, describe how you would solve a market-sizing question with limited data.",
    "At Google, explain how you would prioritize product improvements when multiple teams request support.",
  ],
};

function selectMarketQuestion(track: string, history: ChatHistoryItem[]) {
  const questions = mockMarketQuestions[track] || mockMarketQuestions.technical;
  const answered = history.filter((item) => item.role === "model").length;
  return questions[answered % questions.length];
}

function isReadyPrompt(message: string) {
  return /ready|start|begin|yes/i.test(message);
}

export async function generateChatReply(input: {
  message: string;
  history: ChatHistoryItem[];
  context?: unknown;
}): Promise<string> {
  const userMessage = input.message.trim();
  const track = typeof input.context === "object" && input.context !== null && "track" in input.context
    ? (input.context as any).track
    : "technical";

  const provider = getAIProvider();

  if (provider === "openai") {
    const openai = getOpenAIClient();
    if (!openai) {
      // Fallback to mock responses
      if (isReadyPrompt(userMessage) || input.history.length === 0) {
        const question = selectMarketQuestion(track, input.history);
        return `Let's begin with a market-focused interview question from top companies. ${question} Please walk me through your reasoning step by step, and at the end mention one tradeoff you considered.`;
      }

      if (!/reasoning|tradeoff|step by step/i.test(userMessage)) {
        return "Great. Now walk me through your reasoning step by step and mention one tradeoff you considered in your answer.";
      }

      const nextQuestion = selectMarketQuestion(track, input.history);
      return `Nice detail. Next question: ${nextQuestion} Please answer clearly and include the tradeoffs you evaluated.`;
    }

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `You are an expert technical and HR interviewer. Context: ${JSON.stringify(
            input.context ?? {}
          )}. Ask one question at a time and keep responses concise and interview-focused.`,
        },
      ];

      // Convert history to OpenAI format
      for (const item of input.history) {
        messages.push({
          role: item.role === "user" ? "user" : "assistant",
          content: item.parts[0]?.text || "",
        });
      }

      messages.push({
        role: "user",
        content: userMessage,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });

      return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("OpenAI chat error:", error);
      return "I apologize, but I encountered an error. Please try again.";
    }
  }

  // Gemini provider
  const gemini = getGeminiClient();
  if (!gemini) {
    // Fallback to mock responses
    if (isReadyPrompt(userMessage) || input.history.length === 0) {
      const question = selectMarketQuestion(track, input.history);
      return `Let's begin with a market-focused interview question from top companies. ${question} Please walk me through your reasoning step by step, and at the end mention one tradeoff you considered.`;
    }

    if (!/reasoning|tradeoff|step by step/i.test(userMessage)) {
      return "Great. Now walk me through your reasoning step by step and mention one tradeoff you considered in your answer.";
    }

    const nextQuestion = selectMarketQuestion(track, input.history);
    return `Nice detail. Next question: ${nextQuestion} Please answer clearly and include the tradeoffs you evaluated.`;
  }

  try {
    const chat = gemini.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are an expert technical and HR interviewer. Context: ${JSON.stringify(
          input.context ?? {}
        )}. Ask one question at a time and keep responses concise and interview-focused.`,
      },
      history: input.history || [],
    });

    const response = await chat.sendMessage({ message: input.message });
    return response.text;
  } catch (error) {
    console.error("Gemini chat error:", error);
    return "I apologize, but I encountered an error. Please try again.";
  }
}

function mockEvaluation(): EvaluationResult {
  return {
    score: 7,
    feedback:
      "Your answer is clear and structured. Add concrete examples and measurable outcomes to increase impact.",
    correctPoints: [
      "You addressed the core problem",
      "You explained your approach logically",
    ],
    improvementAreas: [
      "Add metrics/results",
      "Mention risks and tradeoffs",
    ],
  };
}

export async function evaluateAnswer(input: {
  question: string;
  answer: string;
}): Promise<EvaluationResult> {
  const provider = getAIProvider();

  if (provider === "openai") {
    const openai = getOpenAIClient();
    if (!openai) {
      return mockEvaluation();
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert interview evaluator. Return only valid JSON.",
          },
          {
            role: "user",
            content: `Question: ${input.question}\nAnswer: ${input.answer}\nEvaluate on accuracy, confidence, and clarity. Return strict JSON: {"score":0,"feedback":"...","correctPoints":["..."],"improvementAreas":["..."]}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return safeJsonParse(content, mockEvaluation());
    } catch (error) {
      console.error("OpenAI evaluation error:", error);
      return mockEvaluation();
    }
  }

  // Gemini provider
  const gemini = getGeminiClient();
  if (!gemini) {
    return mockEvaluation();
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Question: ${input.question}\nAnswer: ${input.answer}\nEvaluate on accuracy, confidence, and clarity. Return strict JSON: {"score":0,"feedback":"...","correctPoints":["..."],"improvementAreas":["..."]}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    return safeJsonParse(response.text, mockEvaluation());
  } catch (error) {
    console.error("Gemini evaluation error:", error);
    return mockEvaluation();
  }
}

export function isAiConfigured() {
  const provider = getAIProvider();
  if (provider === "openai") {
    return Boolean(process.env.OPENAI_API_KEY);
  }
  return Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);
}

type EnhancedResumeAnalysisResult = {
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

function mockEnhancedResumeAnalysis(role: string, hasJobDescription: boolean): EnhancedResumeAnalysisResult {
  return {
    analysis:
      "Strong technical profile with clear implementation experience. Your resume demonstrates solid technical skills and project experience. Consider adding more quantifiable achievements and metrics to strengthen your impact.",
    suggestedQuestions: [
      `Tell me about a difficult ${role || "software"} problem you solved end-to-end.`,
      "How do you debug a production issue under time pressure?",
      "Describe a project where you improved system performance significantly.",
      "How do you balance technical debt with feature development?",
      "What's your approach to code reviews and maintaining code quality?",
    ],
    skills: ["React", "Node.js", "TypeScript", "System Design", "Testing", "Git", "REST APIs"],
    atsScore: 78,
    missingKeywords: hasJobDescription
      ? ["Kubernetes", "Docker", "CI/CD", "Microservices", "AWS"]
      : ["Cloud platforms", "DevOps tools", "Agile methodologies"],
    improvements: [
      "Add quantifiable metrics to your achievements (e.g., 'Improved performance by 40%')",
      "Include more action verbs at the start of bullet points",
      "Add a technical skills section with proficiency levels",
      "Mention team size and your role in collaborative projects",
      "Include relevant certifications or courses completed",
    ],
    jobMatchScore: hasJobDescription ? 72 : undefined,
    strengthAreas: [
      "Strong technical foundation in modern web technologies",
      "Clear project descriptions with technical details",
      "Good balance of frontend and backend experience",
    ],
    weaknessAreas: [
      "Limited quantifiable impact metrics",
      "Missing some key industry-standard tools",
      "Could emphasize leadership and collaboration more",
    ],
  };
}

export async function analyzeResumeEnhanced(input: {
  role?: string;
  fileName?: string;
  fileSize?: number;
  jobDescription?: string;
}): Promise<EnhancedResumeAnalysisResult> {
  const role = input.role?.trim() || "Software Engineer";
  const hasJobDescription = Boolean(input.jobDescription?.trim());
  const provider = getAIProvider();

  if (provider === "openai") {
    const openai = getOpenAIClient();
    if (!openai) {
      return mockEnhancedResumeAnalysis(role, hasJobDescription);
    }

    try {
      const prompt = hasJobDescription
        ? `Analyze this resume for a ${role} position against the following job description.
Resume metadata: file=${input.fileName || "uploaded.pdf"}, sizeBytes=${input.fileSize || 0}
Job Description: ${input.jobDescription}

Provide a comprehensive analysis including:
1. Overall analysis and summary
2. ATS score (0-100)
3. Detected skills
4. Missing keywords from job description
5. Specific improvement suggestions
6. Job match score (0-100)
7. Strength areas
8. Weakness areas
9. Suggested interview questions

Return strictly JSON: {
  "analysis": "...",
  "atsScore": 0,
  "skills": ["..."],
  "missingKeywords": ["..."],
  "improvements": ["..."],
  "jobMatchScore": 0,
  "strengthAreas": ["..."],
  "weaknessAreas": ["..."],
  "suggestedQuestions": ["..."]
}`
        : `Analyze this resume for a ${role} position.
Resume metadata: file=${input.fileName || "uploaded.pdf"}, sizeBytes=${input.fileSize || 0}

Provide a comprehensive analysis including:
1. Overall analysis and summary
2. ATS score (0-100)
3. Detected skills
4. General missing keywords for the role
5. Specific improvement suggestions
6. Strength areas
7. Weakness areas
8. Suggested interview questions

Return strictly JSON: {
  "analysis": "...",
  "atsScore": 0,
  "skills": ["..."],
  "missingKeywords": ["..."],
  "improvements": ["..."],
  "strengthAreas": ["..."],
  "weaknessAreas": ["..."],
  "suggestedQuestions": ["..."]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert resume analyzer and ATS specialist. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return safeJsonParse(content, mockEnhancedResumeAnalysis(role, hasJobDescription));
    } catch (error) {
      console.error("OpenAI enhanced resume analysis error:", error);
      return mockEnhancedResumeAnalysis(role, hasJobDescription);
    }
  }

  // Gemini provider
  const gemini = getGeminiClient();
  if (!gemini) {
    return mockEnhancedResumeAnalysis(role, hasJobDescription);
  }

  try {
    const prompt = hasJobDescription
      ? `Analyze this resume for a ${role} position against the following job description.
Resume metadata: file=${input.fileName || "uploaded.pdf"}, sizeBytes=${input.fileSize || 0}
Job Description: ${input.jobDescription}

Provide a comprehensive analysis including:
1. Overall analysis and summary
2. ATS score (0-100)
3. Detected skills
4. Missing keywords from job description
5. Specific improvement suggestions
6. Job match score (0-100)
7. Strength areas
8. Weakness areas
9. Suggested interview questions

Return strictly JSON: {
  "analysis": "...",
  "atsScore": 0,
  "skills": ["..."],
  "missingKeywords": ["..."],
  "improvements": ["..."],
  "jobMatchScore": 0,
  "strengthAreas": ["..."],
  "weaknessAreas": ["..."],
  "suggestedQuestions": ["..."]
}`
      : `Analyze this resume for a ${role} position.
Resume metadata: file=${input.fileName || "uploaded.pdf"}, sizeBytes=${input.fileSize || 0}

Provide a comprehensive analysis including:
1. Overall analysis and summary
2. ATS score (0-100)
3. Detected skills
4. General missing keywords for the role
5. Specific improvement suggestions
6. Strength areas
7. Weakness areas
8. Suggested interview questions

Return strictly JSON: {
  "analysis": "...",
  "atsScore": 0,
  "skills": ["..."],
  "missingKeywords": ["..."],
  "improvements": ["..."],
  "strengthAreas": ["..."],
  "weaknessAreas": ["..."],
  "suggestedQuestions": ["..."]
}`;

    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return safeJsonParse(response.text, mockEnhancedResumeAnalysis(role, hasJobDescription));
  } catch (error) {
    console.error("Gemini enhanced resume analysis error:", error);
    return mockEnhancedResumeAnalysis(role, hasJobDescription);
  }
}

type RoadmapData = {
  monthlyPlan: Array<{
    month: number;
    focus: string;
    goals: string[];
    milestones: string[];
  }>;
  skills: Array<{
    name: string;
    level: string;
    priority: string;
    timeframe: string;
    progress: number;
  }>;
  courses: Array<{
    title: string;
    platform: string;
    duration: string;
    link: string;
    rating: number;
  }>;
  youtubeVideos: Array<{
    title: string;
    channel: string;
    duration: string;
    link: string;
    views: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    difficulty: string;
    technologies: string[];
    estimatedTime: string;
  }>;
  certifications: Array<{
    name: string;
    provider: string;
    difficulty: string;
    cost: string;
    duration: string;
  }>;
  interviewPrep: Array<{
    topic: string;
    resources: string[];
    practiceTime: string;
  }>;
  dailyPractice: {
    coding: string;
    reading: string;
    projects: string;
    networking: string;
  };
  salaryInsights: {
    entry: string;
    mid: string;
    senior: string;
    location: string;
  };
  jobRoles: Array<{
    title: string;
    companies: string[];
    requirements: string[];
    salary: string;
  }>;
  aiSuggestions: string[];
  timeline: string;
};

function mockRoadmapData(goal: string, level: string, timeframe: string): RoadmapData {
  const months = timeframe === "3-months" ? 3 : timeframe === "6-months" ? 6 : 12;
  
  return {
    monthlyPlan: Array.from({ length: months }, (_, i) => ({
      month: i + 1,
      focus: i === 0 ? "Fundamentals & Setup" : i === months - 1 ? "Advanced Topics & Portfolio" : "Core Skills Development",
      goals: [
        `Master ${i + 1} key technologies`,
        `Complete ${i + 1} projects`,
        `Practice ${i + 1}0 coding problems`
      ],
      milestones: [
        `Build ${i + 1} portfolio project(s)`,
        `Complete certification module ${i + 1}`,
        `Network with ${i + 1}0 professionals`
      ]
    })),
    skills: [
      { name: "JavaScript/TypeScript", level: "Advanced", priority: "High", timeframe: "Month 1-2", progress: 75 },
      { name: "React & Next.js", level: "Advanced", priority: "High", timeframe: "Month 2-3", progress: 60 },
      { name: "Node.js & Express", level: "Intermediate", priority: "High", timeframe: "Month 3-4", progress: 45 },
      { name: "Database (SQL/NoSQL)", level: "Intermediate", priority: "Medium", timeframe: "Month 4-5", progress: 30 },
      { name: "System Design", level: "Intermediate", priority: "High", timeframe: "Month 5-6", progress: 20 },
      { name: "DevOps & CI/CD", level: "Beginner", priority: "Medium", timeframe: "Month 6+", progress: 10 }
    ],
    courses: [
      { title: "Complete JavaScript Course 2024", platform: "Udemy", duration: "40 hours", link: "https://udemy.com", rating: 4.8 },
      { title: "React - The Complete Guide", platform: "Udemy", duration: "50 hours", link: "https://udemy.com", rating: 4.9 },
      { title: "Node.js Masterclass", platform: "Coursera", duration: "30 hours", link: "https://coursera.org", rating: 4.7 },
      { title: "System Design Interview", platform: "Educative", duration: "20 hours", link: "https://educative.io", rating: 4.8 }
    ],
    youtubeVideos: [
      { title: "JavaScript Full Course", channel: "freeCodeCamp", duration: "3:26:42", link: "https://youtube.com", views: "5M" },
      { title: "React Tutorial for Beginners", channel: "Programming with Mosh", duration: "2:30:15", link: "https://youtube.com", views: "3M" },
      { title: "Node.js Crash Course", channel: "Traversy Media", duration: "1:45:30", link: "https://youtube.com", views: "2M" },
      { title: "System Design Primer", channel: "Tech Dummies", duration: "4:15:20", link: "https://youtube.com", views: "1.5M" }
    ],
    projects: [
      {
        title: "E-commerce Platform",
        description: "Full-stack e-commerce with payment integration",
        difficulty: "Advanced",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        estimatedTime: "4-6 weeks"
      },
      {
        title: "Real-time Chat Application",
        description: "WebSocket-based chat with authentication",
        difficulty: "Intermediate",
        technologies: ["React", "Socket.io", "Express", "PostgreSQL"],
        estimatedTime: "2-3 weeks"
      },
      {
        title: "Task Management System",
        description: "Kanban-style project management tool",
        difficulty: "Intermediate",
        technologies: ["Next.js", "TypeScript", "Prisma", "Tailwind"],
        estimatedTime: "3-4 weeks"
      }
    ],
    certifications: [
      { name: "AWS Certified Developer", provider: "Amazon", difficulty: "Intermediate", cost: "$150", duration: "3 months" },
      { name: "Meta Front-End Developer", provider: "Meta", difficulty: "Beginner", cost: "$39/month", duration: "6 months" },
      { name: "Google Cloud Professional", provider: "Google", difficulty: "Advanced", cost: "$200", duration: "4 months" }
    ],
    interviewPrep: [
      {
        topic: "Data Structures & Algorithms",
        resources: ["LeetCode", "HackerRank", "AlgoExpert"],
        practiceTime: "2 hours/day"
      },
      {
        topic: "System Design",
        resources: ["System Design Primer", "Grokking System Design"],
        practiceTime: "1 hour/day"
      },
      {
        topic: "Behavioral Questions",
        resources: ["STAR method practice", "Mock interviews"],
        practiceTime: "30 min/day"
      }
    ],
    dailyPractice: {
      coding: "2-3 hours: LeetCode problems, algorithm practice",
      reading: "1 hour: Technical blogs, documentation, industry news",
      projects: "2-4 hours: Build portfolio projects, contribute to open source",
      networking: "30 min: LinkedIn engagement, tech community participation"
    },
    salaryInsights: {
      entry: "$70,000 - $90,000",
      mid: "$100,000 - $130,000",
      senior: "$140,000 - $180,000+",
      location: "US Average (varies by location)"
    },
    jobRoles: [
      {
        title: "Full Stack Developer",
        companies: ["Google", "Meta", "Amazon", "Microsoft"],
        requirements: ["React", "Node.js", "Databases", "System Design"],
        salary: "$120,000 - $180,000"
      },
      {
        title: "Frontend Engineer",
        companies: ["Netflix", "Airbnb", "Uber", "Stripe"],
        requirements: ["React/Vue", "TypeScript", "CSS", "Performance"],
        salary: "$110,000 - $160,000"
      },
      {
        title: "Backend Engineer",
        companies: ["Amazon", "LinkedIn", "Salesforce", "Oracle"],
        requirements: ["Node.js", "Databases", "APIs", "Microservices"],
        salary: "$115,000 - $170,000"
      }
    ],
    aiSuggestions: [
      "Focus on building 3-5 strong portfolio projects that demonstrate your skills",
      "Contribute to open-source projects to gain real-world experience",
      "Network actively on LinkedIn and attend tech meetups",
      "Practice coding problems daily to prepare for technical interviews",
      "Create a personal blog to document your learning journey",
      "Join online communities like Discord servers and Reddit for support"
    ],
    timeline: `${months} months intensive learning path`
  };
}

export async function generateCareerRoadmap(input: {
  career?: string;
  goal?: string;
  level?: string;
  currentLevel?: string;
  timeframe: string;
}): Promise<RoadmapData> {
  // Support both parameter names for flexibility
  const goal = input.career || input.goal || "Software Engineer";
  const currentLevel = input.level || input.currentLevel || "Beginner";
  const provider = getAIProvider();

  if (provider === "openai") {
    const openai = getOpenAIClient();
    if (!openai) {
      return mockRoadmapData(goal, currentLevel, input.timeframe);
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert career advisor and technical mentor. Return only valid JSON with comprehensive career roadmap data."
          },
          {
            role: "user",
            content: `Create a detailed career roadmap for someone who wants to become a ${goal}.
Current Level: ${currentLevel}
Timeframe: ${input.timeframe}

Generate a comprehensive roadmap with:
1. Monthly learning plan with specific goals and milestones
2. Skills to learn with priority, timeframe, and progress tracking
3. Recommended courses with ratings
4. YouTube video recommendations
5. Practice projects with difficulty and technologies
6. Relevant certifications
7. Interview preparation topics
8. Daily practice schedule
9. Salary insights for different levels
10. Job roles they can apply for
11. AI-powered suggestions for success

Return strictly JSON matching this structure: ${JSON.stringify(mockRoadmapData(goal, currentLevel, input.timeframe))}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content || "{}";
      return safeJsonParse(content, mockRoadmapData(goal, currentLevel, input.timeframe));
    } catch (error) {
      console.error("OpenAI roadmap generation error:", error);
      return mockRoadmapData(goal, currentLevel, input.timeframe);
    }
  }

  // Gemini provider
  const gemini = getGeminiClient();
  if (!gemini) {
    return mockRoadmapData(goal, currentLevel, input.timeframe);
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a detailed career roadmap for someone who wants to become a ${goal}.
Current Level: ${currentLevel}
Timeframe: ${input.timeframe}

Generate a comprehensive roadmap with:
1. Monthly learning plan with specific goals and milestones
2. Skills to learn with priority, timeframe, and progress tracking
3. Recommended courses with ratings
4. YouTube video recommendations
5. Practice projects with difficulty and technologies
6. Relevant certifications
7. Interview preparation topics
8. Daily practice schedule
9. Salary insights for different levels
10. Job roles they can apply for
11. AI-powered suggestions for success

Return strictly JSON matching this structure: ${JSON.stringify(mockRoadmapData(goal, currentLevel, input.timeframe))}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return safeJsonParse(response.text, mockRoadmapData(goal, currentLevel, input.timeframe));
  } catch (error) {
    console.error("Gemini roadmap generation error:", error);
    return mockRoadmapData(goal, currentLevel, input.timeframe);
  }
}

// AI Mock Interview Service Functions
type MockInterviewQuestion = {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  expectedPoints: string[];
};

type MockInterviewEvaluation = {
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
};

function mockInterviewQuestions(role: string, difficulty: string, techStack: string[], count: number): MockInterviewQuestion[] {
  const questions: MockInterviewQuestion[] = [
    {
      id: "1",
      question: `Explain how you would design a scalable ${techStack[0] || 'web'} application architecture for ${role}.`,
      category: "System Design",
      difficulty,
      expectedPoints: [
        "Discuss scalability patterns",
        "Mention load balancing",
        "Consider database design",
        "Address caching strategies"
      ]
    },
    {
      id: "2",
      question: `Describe a challenging bug you encountered while working with ${techStack[1] || 'JavaScript'} and how you resolved it.`,
      category: "Problem Solving",
      difficulty,
      expectedPoints: [
        "Explain debugging approach",
        "Discuss root cause analysis",
        "Mention tools used",
        "Describe the solution"
      ]
    },
    {
      id: "3",
      question: `How would you optimize the performance of a ${techStack[0] || 'React'} application?`,
      category: "Performance",
      difficulty,
      expectedPoints: [
        "Code splitting",
        "Lazy loading",
        "Memoization",
        "Bundle optimization"
      ]
    },
    {
      id: "4",
      question: `Tell me about a time you had to make a technical decision with incomplete information.`,
      category: "Behavioral",
      difficulty,
      expectedPoints: [
        "Decision-making process",
        "Risk assessment",
        "Stakeholder communication",
        "Outcome and learnings"
      ]
    },
    {
      id: "5",
      question: `How do you ensure code quality and maintainability in ${techStack[2] || 'TypeScript'} projects?`,
      category: "Best Practices",
      difficulty,
      expectedPoints: [
        "Code reviews",
        "Testing strategies",
        "Documentation",
        "Design patterns"
      ]
    }
  ];

  return questions.slice(0, count);
}

export async function generateMockInterviewQuestions(input: {
  role: string;
  difficulty: string;
  techStack: string[];
  count: number;
}): Promise<MockInterviewQuestion[]> {
  console.log('generateMockInterviewQuestions called with:', input);
  
  const provider = getAIProvider();
  console.log('Using AI provider:', provider);

  if (provider === "openai") {
    const openai = getOpenAIClient();
    if (!openai) {
      console.log('OpenAI client not available, using mock questions');
      return mockInterviewQuestions(input.role, input.difficulty, input.techStack, input.count);
    }

    try {
      console.log('Calling OpenAI API...');
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert technical interviewer. Generate realistic interview questions. Return only valid JSON."
          },
          {
            role: "user",
            content: `Generate ${input.count} interview questions for a ${input.role} position.
Difficulty: ${input.difficulty}
Tech Stack: ${input.techStack.join(", ")}

Include a mix of:
- Technical/coding questions
- System design questions
- Behavioral questions
- Problem-solving scenarios

Return strictly JSON with questions array: {
  "questions": [{
    "id": "1",
    "question": "...",
    "category": "Technical|System Design|Behavioral|Problem Solving",
    "difficulty": "${input.difficulty}",
    "expectedPoints": ["point1", "point2", "point3"]
  }]
}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content || "{}";
      console.log('OpenAI response:', content);
      const parsed = safeJsonParse<{ questions?: MockInterviewQuestion[] }>(content, {});
      
      if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        console.log('Successfully generated questions from OpenAI');
        return parsed.questions;
      }
      
      console.log('Invalid OpenAI response, using mock questions');
      return mockInterviewQuestions(input.role, input.difficulty, input.techStack, input.count);
    } catch (error) {
      console.error("OpenAI question generation error:", error);
      return mockInterviewQuestions(input.role, input.difficulty, input.techStack, input.count);
    }
  }

  // Gemini provider
  const gemini = getGeminiClient();
  if (!gemini) {
    console.log('Gemini client not available, using mock questions');
    return mockInterviewQuestions(input.role, input.difficulty, input.techStack, input.count);
  }

  try {
    console.log('Calling Gemini API...');
    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Generate ${input.count} interview questions for a ${input.role} position.
Difficulty: ${input.difficulty}
Tech Stack: ${input.techStack.join(", ")}

Include a mix of:
- Technical/coding questions
- System design questions
- Behavioral questions
- Problem-solving scenarios

Return strictly JSON with questions array: {
  "questions": [{
    "id": "1",
    "question": "...",
    "category": "Technical|System Design|Behavioral|Problem Solving",
    "difficulty": "${input.difficulty}",
    "expectedPoints": ["point1", "point2", "point3"]
  }]
}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    console.log('Gemini response:', response.text);
    const parsed = safeJsonParse<{ questions?: MockInterviewQuestion[] }>(response.text, {});
    
    if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      console.log('Successfully generated questions from Gemini');
      return parsed.questions;
    }
    
    console.log('Invalid Gemini response, using mock questions');
    return mockInterviewQuestions(input.role, input.difficulty, input.techStack, input.count);
  } catch (error) {
    console.error("Gemini question generation error:", error);
    return mockInterviewQuestions(input.role, input.difficulty, input.techStack, input.count);
  }
}

function mockInterviewEvaluation(communicationScore: number): MockInterviewEvaluation {
  return {
    technicalScore: 78,
    communicationScore: communicationScore || 75,
    confidenceScore: 82,
    overallScore: 78,
    strengths: [
      "Strong technical knowledge demonstrated",
      "Clear and structured responses",
      "Good problem-solving approach",
      "Relevant examples provided"
    ],
    improvements: [
      "Add more specific metrics and outcomes",
      "Reduce filler words for better clarity",
      "Elaborate on trade-offs considered",
      "Provide more context for technical decisions"
    ],
    detailedFeedback: `Overall, you demonstrated solid technical knowledge and problem-solving skills. Your answers were well-structured and showed good understanding of the concepts.

To improve further:
- Include more quantifiable results and metrics in your examples
- Practice reducing filler words to enhance communication clarity
- Discuss trade-offs and alternative approaches more explicitly
- Provide deeper context for your technical decisions

Your communication score of ${communicationScore} indicates ${communicationScore >= 85 ? 'excellent' : communicationScore >= 70 ? 'good' : 'room for improvement in'} verbal communication skills. Continue practicing to refine your interview performance.`
  };
}

export async function evaluateMockInterview(input: {
  session: any;
  communicationMetrics: any;
}): Promise<MockInterviewEvaluation> {
  const provider = getAIProvider();
  const communicationScore = input.communicationMetrics?.communicationScore || 75;

  if (provider === "openai") {
    const openai = getOpenAIClient();
    if (!openai) {
      return mockInterviewEvaluation(communicationScore);
    }

    try {
      const interviewData = input.session.questions.map((q: any, index: number) => {
        const answer = input.session.answers[index];
        return {
          question: q.question,
          category: q.category,
          expectedPoints: q.expectedPoints,
          answer: answer?.answer || "No answer provided",
          duration: answer?.duration || 0
        };
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert interview evaluator. Provide comprehensive feedback on interview performance. Return only valid JSON."
          },
          {
            role: "user",
            content: `Evaluate this mock interview performance:

Role: ${input.session.role}
Difficulty: ${input.session.difficulty}
Tech Stack: ${input.session.techStack.join(", ")}

Interview Q&A:
${JSON.stringify(interviewData, null, 2)}

Communication Metrics:
- Communication Score: ${communicationScore}/100
- Filler Words: ${input.communicationMetrics?.fillerWords?.length || 0}

Provide evaluation with:
1. Technical Score (0-100): Assess technical knowledge and problem-solving
2. Communication Score (0-100): Use provided score as base, adjust based on answer clarity
3. Confidence Score (0-100): Assess confidence and decisiveness
4. Overall Score (0-100): Weighted average
5. Strengths: List 3-5 key strengths
6. Improvements: List 3-5 areas for improvement
7. Detailed Feedback: Comprehensive paragraph with specific examples

Return strictly JSON: {
  "technicalScore": 0,
  "communicationScore": 0,
  "confidenceScore": 0,
  "overallScore": 0,
  "strengths": ["..."],
  "improvements": ["..."],
  "detailedFeedback": "..."
}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content || "{}";
      return safeJsonParse(content, mockInterviewEvaluation(communicationScore));
    } catch (error) {
      console.error("OpenAI interview evaluation error:", error);
      return mockInterviewEvaluation(communicationScore);
    }
  }

  // Gemini provider
  const gemini = getGeminiClient();
  if (!gemini) {
    return mockInterviewEvaluation(communicationScore);
  }

  try {
    const interviewData = input.session.questions.map((q: any, index: number) => {
      const answer = input.session.answers[index];
      return {
        question: q.question,
        category: q.category,
        expectedPoints: q.expectedPoints,
        answer: answer?.answer || "No answer provided",
        duration: answer?.duration || 0
      };
    });

    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate this mock interview performance:

Role: ${input.session.role}
Difficulty: ${input.session.difficulty}
Tech Stack: ${input.session.techStack.join(", ")}

Interview Q&A:
${JSON.stringify(interviewData, null, 2)}

Communication Metrics:
- Communication Score: ${communicationScore}/100
- Filler Words: ${input.communicationMetrics?.fillerWords?.length || 0}

Provide evaluation with:
1. Technical Score (0-100): Assess technical knowledge and problem-solving
2. Communication Score (0-100): Use provided score as base, adjust based on answer clarity
3. Confidence Score (0-100): Assess confidence and decisiveness
4. Overall Score (0-100): Weighted average
5. Strengths: List 3-5 key strengths
6. Improvements: List 3-5 areas for improvement
7. Detailed Feedback: Comprehensive paragraph with specific examples

Return strictly JSON: {
  "technicalScore": 0,
  "communicationScore": 0,
  "confidenceScore": 0,
  "overallScore": 0,
  "strengths": ["..."],
  "improvements": ["..."],
  "detailedFeedback": "..."
}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return safeJsonParse(response.text, mockInterviewEvaluation(communicationScore));
  } catch (error) {
    console.error("Gemini interview evaluation error:", error);
    return mockInterviewEvaluation(communicationScore);
  }
}

// Made with Bob

// Skill Gap Analysis Types and Functions
type SkillGapAnalysisResult = {
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

function mockSkillGapAnalysis(dreamRole: string): SkillGapAnalysisResult {
  return {
    currentSkills: ["JavaScript", "React", "Node.js", "Git", "REST APIs"],
    missingSkills: ["TypeScript", "Docker", "Kubernetes", "System Design", "AWS"],
    weakAreas: ["System Design", "Cloud Architecture", "Microservices"],
    strengthAreas: ["Frontend Development", "API Integration", "Version Control"],
    overallScore: 65,
    jobMatchScore: 70,
    roadmap: [
      {
        skill: "TypeScript",
        priority: "high",
        estimatedTime: "2-3 weeks",
        description: "Master TypeScript for type-safe development and better code quality",
        resources: [
          {
            title: "TypeScript Official Documentation",
            type: "course",
            duration: "10 hours",
          },
          {
            title: "TypeScript Deep Dive",
            type: "book",
          },
          {
            title: "Build a TypeScript Project",
            type: "project",
            duration: "1 week",
          },
        ],
      },
      {
        skill: "System Design",
        priority: "high",
        estimatedTime: "4-6 weeks",
        description: "Learn to design scalable systems and understand architectural patterns",
        resources: [
          {
            title: "System Design Primer",
            type: "course",
            duration: "20 hours",
          },
          {
            title: "Designing Data-Intensive Applications",
            type: "book",
          },
          {
            title: "Design a URL Shortener",
            type: "practice",
            duration: "2 days",
          },
        ],
      },
      {
        skill: "Docker & Kubernetes",
        priority: "medium",
        estimatedTime: "3-4 weeks",
        description: "Containerization and orchestration for modern deployments",
        resources: [
          {
            title: "Docker Mastery Course",
            type: "course",
            duration: "15 hours",
          },
          {
            title: "Kubernetes Basics",
            type: "course",
            duration: "12 hours",
          },
          {
            title: "Deploy Microservices with K8s",
            type: "project",
            duration: "1 week",
          },
        ],
      },
    ],
    recommendations: [
      "Focus on TypeScript first as it's a foundational skill for modern development",
      "Practice system design problems on platforms like LeetCode and System Design Primer",
      "Build at least 2-3 projects showcasing your new skills",
      "Contribute to open-source projects to gain real-world experience",
      "Prepare for behavioral interviews alongside technical preparation",
    ],
    estimatedTimeToReady: "3-4 months",
  };
}

export async function analyzeSkillGap(input: {
  dreamRole: string;
  fileName?: string;
  fileSize?: number;
}): Promise<SkillGapAnalysisResult> {
  const dreamRole = input.dreamRole?.trim() || "Software Engineer";
  const provider = getAIProvider();

  if (provider === "gemini") {
    const client = getGeminiClient();
    if (!client) {
      console.warn("Gemini API not configured, returning mock skill gap analysis");
      return mockSkillGapAnalysis(dreamRole);
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert career advisor and technical recruiter. Analyze the candidate's profile for the role: "${dreamRole}".

Based on typical requirements for this role, provide a comprehensive skill gap analysis in the following JSON format:

{
  "currentSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "weakAreas": ["area1", "area2", ...],
  "strengthAreas": ["area1", "area2", ...],
  "overallScore": 0-100,
  "jobMatchScore": 0-100,
  "roadmap": [
    {
      "skill": "Skill Name",
      "priority": "high|medium|low",
      "estimatedTime": "X weeks/months",
      "description": "Why this skill is important",
      "resources": [
        {
          "title": "Resource Name",
          "type": "course|book|practice|project",
          "duration": "X hours/days"
        }
      ]
    }
  ],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "estimatedTimeToReady": "X months"
}

Provide realistic, actionable advice. Focus on the most critical skills first. Include specific learning resources and projects.`,
        config: {
          responseMimeType: "application/json",
        },
      });

      return safeJsonParse(response.text, mockSkillGapAnalysis(dreamRole));
    } catch (error) {
      console.error("Gemini skill gap analysis error:", error);
      return mockSkillGapAnalysis(dreamRole);
    }
  } else {
    const client = getOpenAIClient();
    if (!client) {
      console.warn("OpenAI API not configured, returning mock skill gap analysis");
      return mockSkillGapAnalysis(dreamRole);
    }

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert career advisor and technical recruiter. Provide skill gap analysis in valid JSON format only.",
          },
          {
            role: "user",
            content: `Analyze the candidate's profile for the role: "${dreamRole}".

Provide a comprehensive skill gap analysis in the following JSON format:

{
  "currentSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "weakAreas": ["area1", "area2", ...],
  "strengthAreas": ["area1", "area2", ...],
  "overallScore": 0-100,
  "jobMatchScore": 0-100,
  "roadmap": [
    {
      "skill": "Skill Name",
      "priority": "high|medium|low",
      "estimatedTime": "X weeks/months",
      "description": "Why this skill is important",
      "resources": [
        {
          "title": "Resource Name",
          "type": "course|book|practice|project",
          "duration": "X hours/days"
        }
      ]
    }
  ],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "estimatedTimeToReady": "X months"
}`,
          },
        ],
        temperature: 0.7,
      });

      const text = completion.choices[0]?.message?.content || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = safeJsonParse<SkillGapAnalysisResult>(
          jsonMatch[0],
          mockSkillGapAnalysis(dreamRole)
        );
        return parsed;
      }

      return mockSkillGapAnalysis(dreamRole);
    } catch (error) {
      console.error("OpenAI skill gap analysis error:", error);
      return mockSkillGapAnalysis(dreamRole);
    }
  }
}
