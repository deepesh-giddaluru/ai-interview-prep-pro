import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Clock, CheckCircle2, XCircle, Code, Lightbulb, Trophy } from "lucide-react";
import { Button } from "./ui/Button";
import { API_BASE_URL } from "@/src/lib/api";

type TestCase = {
  input: string;
  expectedOutput: string;
  passed?: boolean;
};

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  testCases: TestCase[];
  starterCode: string;
};

const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists",
    ],
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
      { input: "[3,3], 6", expectedOutput: "[0,1]" },
    ],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    examples: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character",
    ],
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
    ],
    starterCode: `function reverseString(s) {
  // Write your solution here
  
}`,
  },
];

export function CodingInterviewArena() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(SAMPLE_PROBLEMS[0]);
  const [code, setCode] = useState(selectedProblem.starterCode);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setCode(selectedProblem.starterCode);
    setTestResults([]);
    setFeedback("");
    setShowHint(false);
  }, [selectedProblem]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRunCode = async () => {
    if (!isRunning) {
      setIsRunning(true);
    }

    try {
      // Simulate running test cases
      const results = selectedProblem.testCases.map((testCase) => ({
        ...testCase,
        passed: Math.random() > 0.3, // Mock: 70% pass rate
      }));
      setTestResults(results);

      // Get AI feedback
      const response = await fetch(`${API_BASE_URL}/api/evaluate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: selectedProblem.title,
          code,
          testResults: results,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
      } else {
        setFeedback("Good attempt! Consider edge cases and optimize time complexity.");
      }
    } catch (error) {
      setFeedback("Code execution completed. Review test results for improvements.");
    }
  };

  const handleSubmit = () => {
    handleRunCode();
    const passedAll = testResults.every((t) => t.passed);
    if (passedAll) {
      alert("🎉 All test cases passed! Great job!");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-500/10";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "hard":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-text-secondary bg-white/5";
    }
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-secondary">Coding Arena</p>
          <h1 className="text-4xl font-bold text-white">Live Coding Interview</h1>
          <p className="mt-2 text-text-secondary">
            Practice coding problems in a real interview environment with AI feedback
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Clock className="h-4 w-4 text-brand" />
            <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm">Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Problem Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SAMPLE_PROBLEMS.map((problem) => (
          <button
            key={problem.id}
            onClick={() => setSelectedProblem(problem)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedProblem.id === problem.id
                ? "bg-brand text-white"
                : "bg-white/5 text-text-secondary hover:bg-white/10"
            }`}
          >
            {problem.title}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Problem Description */}
        <div className="space-y-6">
          <section className="elegant-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{selectedProblem.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedProblem.difficulty)}`}>
                {selectedProblem.difficulty}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed">{selectedProblem.description}</p>
          </section>

          <section className="elegant-card space-y-4">
            <h3 className="text-lg font-semibold text-white">Examples</h3>
            {selectedProblem.examples.map((example, index) => (
              <div key={index} className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-white">Input:</span> {example.input}
                </p>
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-white">Output:</span> {example.output}
                </p>
                {example.explanation && (
                  <p className="text-sm text-text-muted">
                    <span className="font-semibold">Explanation:</span> {example.explanation}
                  </p>
                )}
              </div>
            ))}
          </section>

          <section className="elegant-card space-y-4">
            <h3 className="text-lg font-semibold text-white">Constraints</h3>
            <ul className="space-y-2">
              {selectedProblem.constraints.map((constraint, index) => (
                <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-brand mt-1">•</span>
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </section>

          {showHint && (
            <section className="elegant-card space-y-4 border-brand/20">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">Hint</h3>
              </div>
              <p className="text-text-secondary">
                Consider using a hash map to store values you've seen. This allows O(1) lookup time.
              </p>
            </section>
          )}

          <Button variant="outline" onClick={() => setShowHint(!showHint)} className="w-full">
            <Lightbulb className="mr-2 h-4 w-4" />
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
        </div>

        {/* Code Editor & Results */}
        <div className="space-y-6">
          <section className="elegant-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">Code Editor</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRunCode}>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </Button>
                <Button size="sm" onClick={handleSubmit}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <Editor
                height="400px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </section>

          {/* Test Results */}
          {testResults.length > 0 && (
            <section className="elegant-card space-y-4">
              <h3 className="text-lg font-semibold text-white">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-4 border ${
                      result.passed
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Test Case {index + 1}</span>
                      {result.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">Input: {result.input}</p>
                    <p className="text-xs text-text-secondary">Expected: {result.expectedOutput}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AI Feedback */}
          {feedback && (
            <section className="elegant-card space-y-4 border-brand/20">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-white">AI Feedback</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">{feedback}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
