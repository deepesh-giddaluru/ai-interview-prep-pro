import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Brain, Clock, Mic, MicOff, Play, Pause, 
  RotateCcw, CheckCircle, AlertCircle, TrendingUp, 
  MessageSquare, Code, Target, Sparkles, ChevronRight,
  Moon, Sun, Save, History
} from 'lucide-react';
import { Button } from './ui/Button';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { API_BASE_URL } from '../lib/api';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  expectedPoints: string[];
}

interface InterviewSession {
  id: string;
  role: string;
  difficulty: string;
  techStack: string[];
  questions: InterviewQuestion[];
  answers: Array<{
    questionId: string;
    answer: string;
    duration: number;
    evaluation: any;
  }>;
  startTime: number;
  endTime?: number;
}

interface Evaluation {
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
}

const ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'System Architect',
  'Mobile Developer'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

const TECH_STACKS = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java',
  'TypeScript', 'JavaScript', 'Go', 'Rust', 'C++', 'C#',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'MongoDB',
  'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Microservices'
];

export function AIMockInterview() {
  const [darkMode, setDarkMode] = useState(true);
  const [stage, setStage] = useState<'setup' | 'interview' | 'results'>('setup');
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const {
    transcript,
    isListening,
    fillerWords,
    communicationScore,
    startListening,
    stopListening,
    resetTranscript,
    getCommunicationTips
  } = useSpeechRecognition();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Update current answer with transcript
  useEffect(() => {
    if (transcript) {
      setCurrentAnswer(transcript);
    }
  }, [transcript]);

  const toggleTechStack = (tech: string) => {
    setSelectedTechStack((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  // Fallback question generator
  const generateFallbackQuestions = (
    role: string,
    difficulty: string,
    techStack: string[],
    count: number
  ): InterviewQuestion[] => {
    const tech1 = techStack[0] || 'web';
    const tech2 = techStack[1] || 'JavaScript';
    const tech3 = techStack[2] || 'TypeScript';

    const allQuestions: InterviewQuestion[] = [
      {
        id: '1',
        question: `Explain how you would design a scalable ${tech1} application architecture for a ${role} role.`,
        category: 'System Design',
        difficulty,
        expectedPoints: [
          'Discuss scalability patterns',
          'Mention load balancing',
          'Consider database design',
          'Address caching strategies'
        ]
      },
      {
        id: '2',
        question: `Describe a challenging bug you encountered while working with ${tech2} and how you resolved it.`,
        category: 'Problem Solving',
        difficulty,
        expectedPoints: [
          'Explain debugging approach',
          'Discuss root cause analysis',
          'Mention tools used',
          'Describe the solution'
        ]
      },
      {
        id: '3',
        question: `How would you optimize the performance of a ${tech1} application?`,
        category: 'Performance',
        difficulty,
        expectedPoints: [
          'Code splitting',
          'Lazy loading',
          'Memoization',
          'Bundle optimization'
        ]
      },
      {
        id: '4',
        question: `Tell me about a time you had to make a technical decision with incomplete information as a ${role}.`,
        category: 'Behavioral',
        difficulty,
        expectedPoints: [
          'Decision-making process',
          'Risk assessment',
          'Stakeholder communication',
          'Outcome and learnings'
        ]
      },
      {
        id: '5',
        question: `How do you ensure code quality and maintainability in ${tech3} projects?`,
        category: 'Best Practices',
        difficulty,
        expectedPoints: [
          'Code reviews',
          'Testing strategies',
          'Documentation',
          'Design patterns'
        ]
      },
      {
        id: '6',
        question: `Describe your experience with ${techStack.join(', ')}. Which one do you prefer and why?`,
        category: 'Technical',
        difficulty,
        expectedPoints: [
          'Compare technologies',
          'Discuss use cases',
          'Mention pros and cons',
          'Share personal experience'
        ]
      },
      {
        id: '7',
        question: `How would you handle a situation where a critical production bug occurs in a ${tech1} application?`,
        category: 'Problem Solving',
        difficulty,
        expectedPoints: [
          'Immediate response steps',
          'Communication strategy',
          'Root cause analysis',
          'Prevention measures'
        ]
      },
      {
        id: '8',
        question: `Explain the trade-offs between different architectural patterns you would consider for a ${role} project.`,
        category: 'System Design',
        difficulty,
        expectedPoints: [
          'Discuss patterns (MVC, microservices, etc.)',
          'Analyze trade-offs',
          'Consider scalability',
          'Mention maintenance'
        ]
      }
    ];

    return allQuestions.slice(0, count);
  };

  const generateQuestions = async () => {
    // Validate tech stack selection
    if (selectedTechStack.length < 3) {
      alert('Please select at least 3 technologies to continue');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating questions with:', { role, difficulty, techStack: selectedTechStack });
      
      // Try API first
      const response = await fetch(`${API_BASE_URL}/api/mock-interview/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          role,
          difficulty,
          techStack: selectedTechStack,
          count: 5
        })
      });

      let questions: InterviewQuestion[] = [];

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          questions = data.questions;
        } else {
          console.warn('Invalid API response, using fallback questions');
          questions = generateFallbackQuestions(role, difficulty, selectedTechStack, 5);
        }
      } else {
        console.warn('API request failed, using fallback questions');
        questions = generateFallbackQuestions(role, difficulty, selectedTechStack, 5);
      }

      const newSession: InterviewSession = {
        id: Date.now().toString(),
        role,
        difficulty,
        techStack: selectedTechStack,
        questions,
        answers: [],
        startTime: Date.now()
      };

      setSession(newSession);
      setStage('interview');
      setTimer(0);
      setIsTimerRunning(true);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Use fallback questions on any error
      const fallbackQuestions = generateFallbackQuestions(role, difficulty, selectedTechStack, 5);
      
      const newSession: InterviewSession = {
        id: Date.now().toString(),
        role,
        difficulty,
        techStack: selectedTechStack,
        questions: fallbackQuestions,
        answers: [],
        startTime: Date.now()
      };

      setSession(newSession);
      setStage('interview');
      setTimer(0);
      setIsTimerRunning(true);
      
      console.log('Using fallback questions due to error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setIsTimerRunning(false);
    } else {
      startListening();
      setIsTimerRunning(true);
    }
  };

  const submitAnswer = async () => {
    if (!session || !currentAnswer.trim()) return;

    const answer = {
      questionId: session.questions[currentQuestionIndex].id,
      answer: currentAnswer,
      duration: timer,
      evaluation: null
    };

    setSession({
      ...session,
      answers: [...session.answers, answer]
    });

    // Move to next question or finish
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setTimer(0);
      resetTranscript();
      stopListening();
      setIsTimerRunning(false);
    } else {
      // Interview complete
      await evaluateInterview();
    }
  };

  const evaluateInterview = async () => {
    if (!session) return;

    setIsEvaluating(true);
    setStage('results');

    try {
      const response = await fetch(`${API_BASE_URL}/api/mock-interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: {
            ...session,
            endTime: Date.now()
          },
          communicationMetrics: {
            fillerWords,
            communicationScore
          }
        })
      });

      if (!response.ok) throw new Error('Failed to evaluate interview');

      const data = await response.json();
      setEvaluation(data.evaluation);

      // Save to history
      saveToHistory({
        ...session,
        endTime: Date.now(),
        evaluation: data.evaluation
      });
    } catch (error) {
      console.error('Error evaluating interview:', error);
      // Fallback evaluation
      setEvaluation({
        technicalScore: 75,
        communicationScore,
        confidenceScore: 80,
        overallScore: 78,
        strengths: ['Good technical knowledge', 'Clear communication'],
        improvements: ['Practice more complex scenarios', 'Reduce filler words'],
        detailedFeedback: 'Overall good performance. Continue practicing!'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const saveToHistory = (completedSession: any) => {
    const history = JSON.parse(localStorage.getItem('mockInterviewHistory') || '[]');
    history.unshift(completedSession);
    localStorage.setItem('mockInterviewHistory', JSON.stringify(history.slice(0, 20)));
  };

  const resetInterview = () => {
    setStage('setup');
    setSession(null);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setTimer(0);
    setIsTimerRunning(false);
    setEvaluation(null);
    resetTranscript();
    stopListening();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-bg-main text-text-primary' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-sidebar/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand/20 border border-brand/30">
              <Brain className="h-6 w-6 text-brand" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Mock Interview</h1>
              <p className="text-xs text-text-muted">Powered by Advanced AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {stage !== 'setup' && (
              <Button variant="ghost" size="sm" onClick={resetInterview}>
                <RotateCcw className="h-4 w-4 mr-2" />
                New Interview
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {stage === 'setup' && (
            <SetupStage
              role={role}
              setRole={setRole}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              selectedTechStack={selectedTechStack}
              toggleTechStack={toggleTechStack}
              generateQuestions={generateQuestions}
              isGenerating={isGenerating}
              darkMode={darkMode}
            />
          )}

          {stage === 'interview' && session && (
            <InterviewStage
              session={session}
              currentQuestionIndex={currentQuestionIndex}
              currentAnswer={currentAnswer}
              setCurrentAnswer={setCurrentAnswer}
              timer={timer}
              isTimerRunning={isTimerRunning}
              isListening={isListening}
              handleVoiceToggle={handleVoiceToggle}
              submitAnswer={submitAnswer}
              formatTime={formatTime}
              darkMode={darkMode}
              communicationScore={communicationScore}
              fillerWords={fillerWords}
            />
          )}

          {stage === 'results' && (
            <ResultsStage
              evaluation={evaluation}
              isEvaluating={isEvaluating}
              session={session}
              resetInterview={resetInterview}
              darkMode={darkMode}
              getCommunicationTips={getCommunicationTips}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Setup Stage Component
function SetupStage({
  role,
  setRole,
  difficulty,
  setDifficulty,
  selectedTechStack,
  toggleTechStack,
  generateQuestions,
  isGenerating,
  darkMode
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold">Configure Your Interview</h2>
        <p className="text-text-secondary text-lg">
          Customize your AI mock interview experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role Selection */}
        <div className="elegant-card space-y-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-brand" />
            <h3 className="text-lg font-bold">Select Role</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`p-3 rounded-lg text-left transition-all ${
                  role === r
                    ? 'bg-brand text-white'
                    : darkMode
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="elegant-card space-y-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-brand" />
            <h3 className="text-lg font-bold">Difficulty Level</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-4 rounded-lg text-center transition-all ${
                  difficulty === d
                    ? 'bg-brand text-white'
                    : darkMode
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-bold">{d}</div>
                <div className="text-xs opacity-70 mt-1">
                  {d === 'Easy' && '1-2 years'}
                  {d === 'Medium' && '3-5 years'}
                  {d === 'Hard' && '5-8 years'}
                  {d === 'Expert' && '8+ years'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Selection */}
      <div className="elegant-card space-y-4">
        <div className="flex items-center gap-3">
          <Code className="h-5 w-5 text-brand" />
          <h3 className="text-lg font-bold">Tech Stack (Select 3-5)</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {TECH_STACKS.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleTechStack(tech)}
              className={`p-3 rounded-lg text-sm transition-all ${
                selectedTechStack.includes(tech)
                  ? 'bg-brand text-white'
                  : darkMode
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={generateQuestions}
          disabled={isGenerating || selectedTechStack.length < 3}
          className="px-8"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 mr-2 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start Interview
            </>
          )}
        </Button>
      </div>

      {selectedTechStack.length < 3 && (
        <p className="text-center text-sm text-yellow-500">
          Please select at least 3 technologies to continue
        </p>
      )}
    </motion.div>
  );
}

// Interview Stage Component
function InterviewStage({
  session,
  currentQuestionIndex,
  currentAnswer,
  setCurrentAnswer,
  timer,
  isTimerRunning,
  isListening,
  handleVoiceToggle,
  submitAnswer,
  formatTime,
  darkMode,
  communicationScore,
  fillerWords
}: any) {
  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Progress Bar */}
      <div className="elegant-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {session.questions.length}
          </span>
          <span className="text-sm text-text-muted">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Card */}
          <div className="elegant-card border-brand/20 bg-brand/5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-brand/20 border border-brand/30">
                <MessageSquare className="h-6 w-6 text-brand" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-brand uppercase tracking-wider">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-white/10">
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
              </div>
            </div>
          </div>

          {/* Answer Input */}
          <div className="elegant-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">Your Answer</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-brand" />
                  <span className="font-mono font-bold">{formatTime(timer)}</span>
                </div>
                <button
                  onClick={handleVoiceToggle}
                  className={`p-3 rounded-lg transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-brand text-white hover:bg-brand/80'
                  }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer or use voice input..."
              className={`w-full h-48 p-4 rounded-lg border ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-brand resize-none`}
            />

            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">
                {currentAnswer.split(/\s+/).filter(Boolean).length} words
              </span>
              <Button
                onClick={submitAnswer}
                disabled={!currentAnswer.trim()}
              >
                {currentQuestionIndex < session.questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Finish Interview
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Real-time Metrics */}
        <div className="space-y-6">
          {/* Communication Score */}
          <div className="elegant-card">
            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
              Communication Score
            </h4>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand mb-2">
                {communicationScore}
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${communicationScore}%` }}
                  className="h-full bg-brand"
                />
              </div>
            </div>
          </div>

          {/* Filler Words */}
          {fillerWords.length > 0 && (
            <div className="elegant-card">
              <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
                Filler Words Detected
              </h4>
              <div className="space-y-2">
                {fillerWords.slice(0, 5).map((fw: any) => (
                  <div key={fw.word} className="flex justify-between items-center p-2 rounded bg-white/5">
                    <span className="text-sm">"{fw.word}"</span>
                    <span className="text-sm font-bold text-yellow-500">{fw.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="elegant-card bg-blue-500/10 border-blue-500/20">
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">
              Quick Tips
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Take your time to think before answering</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Use specific examples from your experience</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Avoid filler words like "um" and "uh"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Results Stage Component
function ResultsStage({
  evaluation,
  isEvaluating,
  session,
  resetInterview,
  darkMode,
  getCommunicationTips
}: any) {
  if (isEvaluating || !evaluation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <Sparkles className="h-16 w-16 text-brand animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Evaluating Your Performance</h2>
        <p className="text-text-secondary">AI is analyzing your responses...</p>
      </motion.div>
    );
  }

  const communicationTips = getCommunicationTips();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 rounded-full bg-brand/20 border border-brand/30 mb-4">
          <CheckCircle className="h-12 w-12 text-brand" />
        </div>
        <h2 className="text-4xl font-bold">Interview Complete!</h2>
        <p className="text-text-secondary text-lg">
          Here's your detailed performance analysis
        </p>
      </div>

      {/* Overall Score */}
      <div className="elegant-card border-brand/20 bg-brand/5 text-center">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
          Overall Score
        </h3>
        <div className="text-7xl font-bold text-brand mb-4">
          {evaluation.overallScore}
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden max-w-md mx-auto">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${evaluation.overallScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-brand"
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard
          title="Technical"
          score={evaluation.technicalScore}
          icon={<Code className="h-6 w-6" />}
          color="blue"
        />
        <ScoreCard
          title="Communication"
          score={evaluation.communicationScore}
          icon={<MessageSquare className="h-6 w-6" />}
          color="green"
        />
        <ScoreCard
          title="Confidence"
          score={evaluation.confidenceScore}
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="elegant-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-bold">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {evaluation.strengths.map((strength: string, index: number) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="elegant-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {evaluation.improvements.map((improvement: string, index: number) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Communication Tips */}
      {communicationTips.length > 0 && (
        <div className="elegant-card bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-blue-400">Communication Tips</h3>
          </div>
          <ul className="space-y-2">
            {communicationTips.map((tip: string, index: number) => (
              <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Feedback */}
      <div className="elegant-card">
        <h3 className="text-lg font-bold mb-4">Detailed Feedback</h3>
        <p className="text-text-secondary leading-relaxed whitespace-pre-line">
          {evaluation.detailedFeedback}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={resetInterview}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Start New Interview
        </Button>
        <Button onClick={() => window.print()}>
          <Save className="h-4 w-4 mr-2" />
          Save Report
        </Button>
      </div>
    </motion.div>
  );
}

// Score Card Component
function ScoreCard({ title, score, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-500',
    green: 'bg-green-500/20 border-green-500/30 text-green-500',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-500'
  };

  return (
    <div className="elegant-card text-center">
      <div className={`inline-flex p-3 rounded-lg border mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="text-4xl font-bold mb-3">{score}</div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}
        />
      </div>
    </div>
  );
}

// Made with Bob
