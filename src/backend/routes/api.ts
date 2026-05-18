import { Router } from "express";
import multer from "multer";
import {
  analyzeResume,
  evaluateAnswer,
  generateChatReply,
  isAiConfigured,
} from "../services/interviewService";

const upload = multer({ storage: multer.memoryStorage() });

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", aiConfigured: isAiConfigured() });
});

apiRouter.post("/analyze-resume", upload.single("resume"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const result = await analyzeResume({
      role: typeof req.body?.role === "string" ? req.body.role : "",
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to analyze resume" });
  }
});

apiRouter.post("/chat", async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const text = await generateChatReply({
      message,
      history: Array.isArray(req.body?.history) ? req.body.history : [],
      context: req.body?.context,
    });

    return res.json({ text });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to generate chat reply" });
  }
});

apiRouter.post("/evaluate-answer", async (req, res) => {
  try {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
    const answer = typeof req.body?.answer === "string" ? req.body.answer.trim() : "";

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const result = await evaluateAnswer({ question, answer });
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to evaluate answer" });
  }
});

apiRouter.post("/enhanced-resume-analysis", upload.single("resume"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const { analyzeResumeEnhanced } = await import("../services/interviewService");
    const result = await analyzeResumeEnhanced({
      role: typeof req.body?.role === "string" ? req.body.role : "",
      fileName: req.file.originalname,
      fileSize: req.file.size,
      jobDescription: typeof req.body?.jobDescription === "string" ? req.body.jobDescription : undefined,
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to analyze resume" });
  }
});

apiRouter.post("/generate-roadmap", async (req, res) => {
  try {
    const career = typeof req.body?.career === "string" ? req.body.career.trim() : "";
    const level = typeof req.body?.level === "string" ? req.body.level : "Beginner";
    const timeframe = typeof req.body?.timeframe === "string" ? req.body.timeframe : "6 Months";

    if (!career) {
      return res.status(400).json({ error: "Career goal is required" });
    }

    const { generateCareerRoadmap } = await import("../services/interviewService");
    const roadmap = await generateCareerRoadmap({ career, level, timeframe });

    return res.json({ roadmap });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to generate roadmap" });
  }
});

// AI Mock Interview endpoints
apiRouter.post("/mock-interview/generate-questions", async (req, res) => {
  try {
    const role = typeof req.body?.role === "string" ? req.body.role.trim() : "";
    const difficulty = typeof req.body?.difficulty === "string" ? req.body.difficulty : "Medium";
    const techStack = Array.isArray(req.body?.techStack) ? req.body.techStack : [];
    const count = typeof req.body?.count === "number" ? req.body.count : 5;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const { generateMockInterviewQuestions } = await import("../services/interviewService");
    const questions = await generateMockInterviewQuestions({ role, difficulty, techStack, count });

    return res.json({ questions });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to generate questions" });
  }
});

apiRouter.post("/mock-interview/evaluate", async (req, res) => {
  try {
    const session = req.body?.session;
    const communicationMetrics = req.body?.communicationMetrics;

    if (!session || !session.questions || !session.answers) {
      return res.status(400).json({ error: "Invalid session data" });
    }

    const { evaluateMockInterview } = await import("../services/interviewService");
    const evaluation = await evaluateMockInterview({ session, communicationMetrics });

    return res.json({ evaluation });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to evaluate interview" });
  }
});

// Skill Gap Analysis endpoint
apiRouter.post("/skill-gap-analysis", upload.single("resume"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const dreamRole = typeof req.body?.dreamRole === "string" ? req.body.dreamRole.trim() : "";

    if (!dreamRole) {
      return res.status(400).json({ error: "Dream role is required" });
    }

    const { analyzeSkillGap } = await import("../services/interviewService");
    const result = await analyzeSkillGap({
      dreamRole,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to analyze skill gap" });
  }
});
