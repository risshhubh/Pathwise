import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ListChecks, Code2, BookOpenCheck, ChevronLeft, ChevronRight, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useToast } from "../components/ToastProvider";
import InterviewRoomSkeleton from "../components/InterviewRoomSkeleton";
import { useAuth } from "../context/AuthContext";

const MODES = [
  { id: "mcq", label: "MCQ Based", icon: ListChecks },
  { id: "coding", label: "Coding Based", icon: Code2 },
  { id: "quiz", label: "Quiz Based", icon: BookOpenCheck },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Simple question banks per type + mode. Extend as needed.
const QUESTION_BANK = {
  technical: {
    mcq: [
      {
        id: "t-m-1",
        prompt: "What is the time complexity of binary search on a sorted array?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        answerIndex: 1,
        explanation: "Binary search splits the search space in half each iteration: O(log n).",
      },
      {
        id: "t-m-2",
        prompt: "Which data structure is best for implementing LRU cache in O(1)?",
        options: ["Array", "Stack", "HashMap + Doubly Linked List", "Queue"],
        answerIndex: 2,
        explanation: "HashMap for lookup + Doubly Linked List for O(1) eviction/move-to-front.",
      },
    ],
    coding: [
      {
        id: "t-c-1",
        prompt: "Write a function to return the first non-repeating character in a string.",
        starter: `function firstUniqueChar(s) {\n  // write your solution\n}`,
        rubric: ["Correctness", "Time complexity", "Edge cases (empty, all repeat)"]
      },
      {
        id: "t-c-2",
        prompt: "Implement a function that checks if two strings are anagrams.",
        starter: `function areAnagrams(a, b) {\n  // write your solution\n}`,
        rubric: ["Normalize case/spacing", "Counting vs sorting", "Performance"]
      },
    ],
    quiz: [
      {
        id: "t-q-1",
        prompt: "Briefly describe the difference between processes and threads.",
        placeholder: "Type your answer here...",
        checklist: ["Isolation", "Shared memory", "Context switching"],
      },
      {
        id: "t-q-2",
        prompt: "Explain event loop and microtask queue in JavaScript.",
        placeholder: "Type your answer here...",
        checklist: ["Call stack", "Task vs microtask", "Ordering"]
      },
    ],
  },
  behavioral: {
    mcq: [
      {
        id: "b-m-1",
        prompt: "Which structure best fits the STAR method?",
        options: ["Setup, Try, Answer, Result", "Situation, Task, Action, Result", "Scenario, Target, Action, Review", "State, Task, Action, Review"],
        answerIndex: 1,
        explanation: "STAR stands for Situation, Task, Action, Result.",
      },
      {
        id: "b-m-2",
        prompt: "Best response to a conflict question emphasizes...",
        options: ["Blame others", "Avoid details", "Concrete actions/outcomes", "Speak generally"],
        answerIndex: 2,
        explanation: "Use specifics: actions taken and measurable outcomes.",
      },
    ],
    coding: [
      {
        id: "b-c-1",
        prompt: "Write a concise STAR-format paragraph about handling a tight deadline.",
        starter: `// Use STAR structure\n// S: \n// T: \n// A: \n// R: `,
        rubric: ["Clarity", "Specificity", "Outcome"]
      }
    ],
    quiz: [
      {
        id: "b-q-1",
        prompt: "Describe a time you received critical feedback and what you changed.",
        placeholder: "Type your answer here...",
        checklist: ["Ownership", "Action taken", "Result"]
      }
    ],
  },
  "system-design": {
    mcq: [
      {
        id: "s-m-1",
        prompt: "Which component primarily improves read scalability?",
        options: ["Write-through cache", "Load balancer", "Message queue", "Sharded DB"],
        answerIndex: 1,
        explanation: "Load balancer distributes reads across replicas/services.",
      },
      {
        id: "s-m-2",
        prompt: "Eventual consistency is typically associated with...",
        options: ["CP systems", "AP systems", "CA systems", "ACID RDBMS"],
        answerIndex: 1,
        explanation: "AP-favoring systems often accept eventual consistency.",
      },
    ],
    coding: [
      {
        id: "s-c-1",
        prompt: "Sketch a simple API contract for a URL shortener service.",
        starter: `POST /shorten { url } -> { code }\nGET /:code -> 301 redirect\n// Add notes on rate limiting and analytics`,
        rubric: ["REST clarity", "Edge cases", "Non-functional needs"]
      }
    ],
    quiz: [
      {
        id: "s-q-1",
        prompt: "Explain trade-offs between sharding and replication.",
        placeholder: "Type your answer here...",
        checklist: ["Scale-out", "Availability", "Complexity"]
      }
    ],
  },
};

function Header({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function InterviewRoom() {
  const query = useQuery();
  const navigate = useNavigate();
  const { push } = useToast();
  const { user, refreshUserData } = useAuth();
  const interviewType = (query.get("type") || "technical").toLowerCase();

  const [mode, setMode] = useState(null); // mcq | coding | quiz
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // id -> user answer
  const [submitted, setSubmitted] = useState(false); // overall finished flag (all questions submitted)
  const [questionSubmitted, setQuestionSubmitted] = useState({}); // id -> boolean
  const attemptSavedRef = useRef(false);
  const [showWarning, setShowWarning] = useState(false);
  const QUESTION_TIME = 60; // seconds per question
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [userAttempts, setUserAttempts] = useState([]);
  const [lastReport, setLastReport] = useState(null);
  const [practicePlan, setPracticePlan] = useState(null);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // Ensure each mode has 15 questions by padding from seeds
  const questions = useMemo(() => {
    const bank = QUESTION_BANK[interviewType] || QUESTION_BANK.technical;
    if (!mode) return [];

    const padToLength = (arr, target = 15) => {
      if (!Array.isArray(arr) || arr.length === 0) return [];
      if (arr.length >= target) return arr.slice(0, target);
      const out = [...arr];
      let idx = 0;
      while (out.length < target) {
        const base = arr[idx % arr.length];
        const copyIndex = out.length + 1;
        const cloned = { ...base };
        cloned.id = `${base.id}-x${copyIndex}`;
        if (typeof base.answerIndex === "number") {
          // MCQ: tweak prompt slightly
          cloned.prompt = `${base.prompt} (variant ${copyIndex})`;
        } else if (base.starter) {
          // Coding
          cloned.prompt = `${base.prompt} (v${copyIndex})`;
        } else if (base.placeholder) {
          // Quiz
          cloned.prompt = `${base.prompt} (v${copyIndex})`;
        }
        out.push(cloned);
        idx++;
      }
      return out;
    };

    const list = bank[mode] || [];
    return padToLength(list, 15);
  }, [interviewType, mode]);

  useEffect(() => {
    // Reset progress if mode changes
    setCurrentIndex(0);
    setAnswers({});
    setQuestionSubmitted({});
    setSubmitted(false);
    setShowWarning(!!mode); // show warning as soon as mode is chosen
    setTimeLeft(QUESTION_TIME);
    attemptSavedRef.current = false;
  }, [mode]);

  const current = questions[currentIndex];

  // Shuffle MCQ options once per question set
  const [optionMap, setOptionMap] = useState({}); // qid -> { order: [idx...], answerIndex: number }
  useEffect(() => {
    if (!mode || questions.length === 0) return;
    if (mode !== "mcq") { setOptionMap({}); return; }
    const map = {};
    questions.forEach((q) => {
      const order = [...q.options.keys()].sort(() => Math.random() - 0.5);
      const newAnswerIndex = order.indexOf(q.answerIndex);
      map[q.id] = { order, answerIndex: newAnswerIndex };
    });
    setOptionMap(map);
  }, [mode, questions]);

  const handleAnswer = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const canNext = currentIndex < questions.length - 1;
  const canPrev = currentIndex > 0;

  const computeFinished = (submittedMap) => {
    const allIds = questions.map(q => q.id);
    return allIds.length > 0 && allIds.every(id => submittedMap[id]);
  };

  const persistAttemptIfFinished = async (submittedMap) => {
    const finished = computeFinished(submittedMap);
    if (!finished) return;
    if (attemptSavedRef.current) return;
    attemptSavedRef.current = true;
    setSubmitted(true);
    try {
      const ts = Date.now();
      let percent = null;
      if (mode === "mcq") {
        let correct = 0;
        questions.forEach((q) => {
          const mapped = optionMap[q.id];
          const ans = answers[q.id];
          const correctIndex = mapped ? mapped.answerIndex : q.answerIndex;
          if (typeof ans === "number" && ans === correctIndex) correct += 1;
        });
        percent = Math.round((correct / questions.length) * 100);
      }
      // Build a lightweight post-interview report and practice plan
      const report = buildReport({ interviewType, mode, questions, answers, optionMap, mcqPercent: percent });
      const plan = buildPracticePlan(report);

      // Save to backend API
      const payload = {
        type: interviewType,
        mode,
        scorePercent: percent,
        answers,
        report,
        plan,
      };
      const token = localStorage.getItem('token');
      const response = await fetch('/api/progress/save-attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        // Refresh user stats (interviewsCompleted, averageScore) so dashboard updates immediately
        try { if (typeof refreshUserData === 'function') await refreshUserData(); } catch (e) { /* ignore */ }
        // Save report and plan to localStorage for UI display
        localStorage.setItem("last_report_v1", JSON.stringify({ ...report, timestamp: ts }));
        localStorage.setItem("practice_plan_v1", JSON.stringify(plan));
        // Notify other parts of the app (e.g., Dashboard) to refresh
        try { window.dispatchEvent(new CustomEvent('attempts-updated')); } catch {}
        try { push("Interview attempt saved successfully! View your updated progress on the dashboard.", { type: "success" }); } catch {}
      } else {
        throw new Error('Failed to save attempt to backend');
      }
    } catch (error) {
      console.error('Error saving attempt:', error);
      // Fallback: save to localStorage if API fails
      try {
        const attemptsRaw = localStorage.getItem("interview_attempts_v1");
        const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
        const ts = Date.now();
        let percent = null;
        if (mode === "mcq") {
          let correct = 0;
          questions.forEach((q) => {
            const mapped = optionMap[q.id];
            const ans = answers[q.id];
            const correctIndex = mapped ? mapped.answerIndex : q.answerIndex;
            if (typeof ans === "number" && ans === correctIndex) correct += 1;
          });
          percent = Math.round((correct / questions.length) * 100);
        }
        const last = attempts[attempts.length - 1];
        const isDup = last && last.type === interviewType && last.mode === mode && Math.abs(ts - last.timestamp) < 1500;
        if (!isDup) {
          attempts.push({ type: interviewType, mode, timestamp: ts, scorePercent: percent });
        }
        localStorage.setItem("interview_attempts_v1", JSON.stringify(attempts));
        const report = buildReport({ interviewType, mode, questions, answers, optionMap, mcqPercent: percent });
        localStorage.setItem("last_report_v1", JSON.stringify({ ...report, timestamp: ts }));
        const plan = buildPracticePlan(report);
        localStorage.setItem("practice_plan_v1", JSON.stringify(plan));
        try { window.dispatchEvent(new CustomEvent('attempts-updated')); } catch {}
        try { push("Interview attempt saved locally! View your updated progress on the dashboard.", { type: "success" }); } catch {}
      } catch (fallbackError) {
        console.error('Fallback save failed:', fallbackError);
      }
    }
  };

  function scoreClarityFromText(text) {
    if (!text) return 0;
    const len = text.trim().length;
    if (len < 40) return 40;
    if (len < 120) return 65;
    if (len < 300) return 80;
    return 90;
  }

  function scoreStructureFromKeywords(text, keywords) {
    if (!text || !keywords || !keywords.length) return 60;
    const lower = text.toLowerCase();
    let hits = 0;
    keywords.forEach(k => { if (lower.includes(String(k).toLowerCase().split(' ')[0])) hits += 1; });
    const pct = Math.min(100, Math.round((hits / keywords.length) * 100));
    return Math.max(60, pct);
  }

  function buildReport({ interviewType, mode, questions, answers, optionMap, mcqPercent }) {
    // correctness
    const correctness = typeof mcqPercent === 'number' ? mcqPercent : 0;
    // clarity & structure approximations from free-text modes
    let claritySum = 0, clarityCount = 0;
    let structureSum = 0, structureCount = 0;
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (mode === 'coding' || mode === 'quiz') {
        if (typeof ans === 'string') {
          claritySum += scoreClarityFromText(ans);
          clarityCount += 1;
          const keys = q.checklist || q.rubric || [];
          structureSum += scoreStructureFromKeywords(ans, keys);
          structureCount += 1;
        }
      }
    });
    const clarity = clarityCount ? Math.round(claritySum / clarityCount) : (mode === 'mcq' ? 70 : 0);
    const structure = structureCount ? Math.round(structureSum / structureCount) : (mode === 'mcq' ? 65 : 0);
    const strengths = [];
    const weaknesses = [];
    if (correctness >= 75) strengths.push('Correctness'); else weaknesses.push('Correctness');
    if (clarity >= 75) strengths.push('Clarity'); else weaknesses.push('Clarity');
    if (structure >= 75) strengths.push('Structure'); else weaknesses.push('Structure');
    const resources = buildResources({ interviewType, weaknesses });
    return { type: interviewType, mode, scores: { correctness, clarity, structure }, strengths, weaknesses, resources };
  }

  function buildResources({ interviewType, weaknesses }) {
    const links = {
      Correctness: [
        { title: 'LeetCode Patterns', url: 'https://seanprashad.com/leetcode-patterns/' },
        { title: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap' },
      ],
      Clarity: [
        { title: 'STAR Method Guide', url: 'https://www.themuse.com/advice/star-interview-method' },
        { title: 'Technical Communication Tips', url: 'https://www.khanacademy.org/college-careers-more/career-content' },
      ],
      Structure: [
        { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
        { title: 'Grokking the System Design', url: 'https://www.designgurus.io/course/grokking-the-system-design-interview' },
      ],
    };
    let out = [];
    weaknesses.forEach((w) => { out = out.concat(links[w] || []); });
    return out.slice(0, 4);
  }

  function buildPracticePlan(report) {
    const now = Date.now();
    const weak = report.weaknesses;
    const entries = weak.map((w) => ({ topic: w, due: [now + 1*86400000, now + 3*86400000, now + 7*86400000] }));
    return { generatedAt: now, entries };
  }

  const submitCurrentQuestion = () => {
    if (!current) return;
    setQuestionSubmitted((prev) => {
      const next = { ...prev, [current.id]: true };
      persistAttemptIfFinished(next);
      return next;
    });
  };

  const score = useMemo(() => {
    if (!submitted || mode !== "mcq") return null;
    let correct = 0;
    questions.forEach((q) => {
      const mapped = optionMap[q.id];
      const correctIndex = mapped ? mapped.answerIndex : q.answerIndex;
      if (typeof answers[q.id] === "number" && answers[q.id] === correctIndex) correct += 1;
    });
    return { correct, total: questions.length, percent: Math.round((correct / questions.length) * 100) };
  }, [submitted, mode, questions, answers, optionMap]);

  const restart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(QUESTION_TIME);
  };

  // Timer effect (per question). Paused while warning is visible or once submitted.
  useEffect(() => {
    if (!mode || submitted || showWarning || questions.length === 0) return;
    setTimeLeft(QUESTION_TIME);
  }, [currentIndex, mode, submitted, showWarning, questions.length]);

  useEffect(() => {
    if (!mode || showWarning || questions.length === 0) return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tick);
          // auto-submit current if not submitted, then advance
          setQuestionSubmitted((prev) => {
            const already = prev[current?.id];
            const nextMap = already ? prev : { ...prev, [current?.id]: true };
            persistAttemptIfFinished(nextMap);
            return nextMap;
          });
          if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
          return QUESTION_TIME; // reset for next question if any
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [mode, showWarning, questions.length, currentIndex, current]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
        <Header
          title="Interview Room"
          subtitle={`Type: ${interviewType.replace("-", " ").toUpperCase()}`}
        />

        {!mode && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODES.map((m) => (
              <motion.button
                key={m.id}
                onClick={() => setMode(m.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer bg-white/5 border border-gray-800 rounded-2xl p-6 text-left hover:border-gray-600 transition relative overflow-hidden"
              >
                <span className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-fuchsia-600/30 to-cyan-500/30 rounded-full blur-2xl"></span>
                <div className="flex items-center gap-3 mb-3">
                  <m.icon className="text-purple-400" />
                  <span className="font-semibold">{m.label}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {m.id === "mcq" && "Multiple-choice questions with instant scoring."}
                  {m.id === "coding" && "Write code or structured answers. Focus on clarity and correctness."}
                  {m.id === "quiz" && "Short-form responses with a self-review checklist."}
                </p>
              </motion.button>
            ))}
          </div>
        )}

        {mode && (
          <div className="mt-6">
            {/* Top controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Bot size={18} className="text-purple-400" />
                <span className="uppercase text-xs tracking-wider">{mode} mode</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode(null)}
                  className="cursor-pointer px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5"
                >
                  Change Mode
                </button>
                <button
                  onClick={() => navigate("/interview")}
                  className="cursor-pointer px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Seriousness Warning Overlay */}
            {showWarning && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="relative w-[90%] max-w-lg bg-gradient-to-b from-gray-900/90 to-black/80 border border-white/10 rounded-2xl p-6 text-center overflow-hidden"
                >
                  <span className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-fuchsia-600/25 to-cyan-500/25 rounded-full blur-3xl"></span>
                  <div className="relative z-10">
                    <div className="text-5xl mb-2">⚡</div>
                    <h3 className="text-xl font-bold mb-2">Serious Mode Engaged</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Keep it focused and give it your best shot. Each question has a timer. No pressure... okay maybe a little. You got this! 💪
                    </p>
                    <div className="mt-5 flex gap-3 justify-center">
                      <button
                        onClick={() => setShowWarning(false)}
                        className="cursor-pointer px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                      >
                        I’m Ready 🚀
                      </button>
                      <button
                        onClick={() => {
                          setMode(null);
                          setShowWarning(false);
                        }}
                        className="cursor-pointer px-5 py-2 rounded-lg border border-gray-700 hover:bg-white/5"
                      >
                        Change Mode
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Question card */}
            {questions.length > 0 ? (
              <div className="bg-white/5 border border-gray-800 rounded-2xl p-6">
                {/* Funky Timer Bar */}
                {!submitted && !showWarning && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Time Left</span>
                      <span className={`${timeLeft <= 10 ? "text-red-400" : "text-gray-300"} font-semibold`}>{timeLeft}s</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-1000 ${timeLeft <= 10 ? "animate-pulse" : ""}`}
                        style={{ width: `${Math.max(0, (timeLeft / QUESTION_TIME) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                  <div>
                    Question {currentIndex + 1} of {questions.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={!canPrev}
                      onClick={() => canPrev && setCurrentIndex((i) => i - 1)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        canPrev ? "border-gray-700 hover:bg-white/5 cursor-pointer" : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <button
                      disabled={!canNext}
                      onClick={() => canNext && setCurrentIndex((i) => i + 1)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        canNext ? "border-gray-700 hover:bg-white/5 cursor-pointer" : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                <h2 className="text-lg font-semibold mb-4">{current?.prompt}</h2>

                {/* Render by mode */}
                {mode === "mcq" && (
                  <div className="space-y-3">
                    {(() => {
                      const map = optionMap[current.id] || { order: [...current.options.keys()], answerIndex: current.answerIndex };
                      return map.order.map((origIdx, idx) => {
                        const opt = current.options[origIdx];
                        const selected = answers[current.id] === idx;
                        const reveal = questionSubmitted[current.id];
                        const correctIndex = map.answerIndex;
                        const isCorrect = reveal && idx === correctIndex;
                        const isWrong = reveal && selected && idx !== correctIndex;
                      return (
                        <button
                          key={idx}
                          disabled={reveal}
                          onClick={() => handleAnswer(current.id, idx)}
                          className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg border transition ${
                            selected ? "border-purple-500/60 bg-purple-500/10" : "border-gray-700 hover:bg-white/5"
                          } ${isCorrect ? "!border-green-500/60 bg-green-500/10" : ""} ${isWrong ? "!border-red-500/60 bg-red-500/10" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt}</span>
                            {reveal && isCorrect && <CheckCircle2 className="text-green-400" size={18} />}
                            {reveal && isWrong && <XCircle className="text-red-400" size={18} />}
                          </div>
                        </button>
                      );
                      });
                    })()}

                    {/* Per-question submit button */}
                    {!questionSubmitted[current.id] && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            const next = { ...(questionSubmitted || {}), [current.id]: true };
                            setQuestionSubmitted(next);
                            persistAttemptIfFinished(next);
                          }}
                          className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90"
                        >
                          Submit Answer
                        </button>
                      </div>
                    )}

                    {questionSubmitted[current.id] && current.explanation && (
                      <div className="mt-3 text-sm text-gray-300 bg-white/5 border border-gray-700 rounded-lg p-3">
                        <span className="text-gray-400">Explanation: </span>
                        {current.explanation}
                      </div>
                    )}
                    {questionSubmitted[current.id] && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="bg-white/5 border border-gray-700 rounded-lg p-3">
                          <div className="text-gray-400 mb-1">Your answer</div>
                          {(() => {
                            const map = optionMap[current.id] || { answerIndex: current.answerIndex };
                            const your = typeof answers[current.id] === 'number' ? answers[current.id] : null;
                            return <div className="font-medium">{your !== null ? current.options[(optionMap[current.id]?.order || [...current.options.keys()])[your]] : '—'}</div>;
                          })()}
                        </div>
                        <div className="bg-white/5 border border-gray-700 rounded-lg p-3">
                          <div className="text-gray-400 mb-1">Correct answer</div>
                          {(() => {
                            const map = optionMap[current.id] || { answerIndex: current.answerIndex };
                            const correctIdx = map.answerIndex;
                            return <div className="font-medium text-green-400">{current.options[(optionMap[current.id]?.order || [...current.options.keys()])[correctIdx]]}</div>;
                          })()}
                        </div>
                        <div className="bg-white/5 border border-gray-700 rounded-lg p-3">
                          <div className="text-gray-400 mb-1">Result</div>
                          {(() => {
                            const map = optionMap[current.id] || { answerIndex: current.answerIndex };
                            const correctIdx = map.answerIndex;
                            const your = answers[current.id];
                            const ok = typeof your === 'number' && your === correctIdx;
                            return <div className={`font-semibold ${ok ? 'text-green-400' : 'text-red-400'}`}>{ok ? 'Correct' : 'Incorrect'}</div>;
                          })()}
                        </div>
                      </div>
                    )}
                    {/* submit button removed as per requirement */}
                    {/* Side-by-side progress and link to dashboard */}
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                      {(() => {
                        let correctSoFar = 0;
                        let attempted = 0;
                        questions.forEach((q) => {
                          if (questionSubmitted[q.id]) {
                            attempted += 1;
                            const map = optionMap[q.id] || { answerIndex: q.answerIndex };
                            if (typeof answers[q.id] === 'number' && answers[q.id] === map.answerIndex) correctSoFar += 1;
                          }
                        });
                        return <span>Progress: {correctSoFar}/{attempted} correct</span>;
                      })()}
                      <button
                        onClick={() => {
                          const el = document.getElementById('results-block');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          try { window.dispatchEvent(new CustomEvent('attempts-updated')); } catch {}
                          // Use router navigation
                          try { /* navigate available from hook */ } catch {}
                          navigate('/dashboard');
                        }}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-white/5 text-gray-200`}
                        title={'Open dashboard to view progress'}
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                )}

                {mode === "coding" && (
                  <div className="space-y-3">
                    <textarea
                      rows={10}
                      className="w-full rounded-lg bg-black/40 border border-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder={current.starter || "Write your solution here..."}
                      value={answers[current.id] || ""}
                      onChange={(e) => handleAnswer(current.id, e.target.value)}
                    />
                    {Array.isArray(current.rubric) && (
                      <div className="text-sm text-gray-400">
                        <span className="block mb-1 text-gray-300">Consider:</span>
                        <ul className="list-disc ml-5">
                          {current.rubric.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Per-question submit for coding */}
                    {!questionSubmitted[current.id] && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            const next = { ...(questionSubmitted || {}), [current.id]: true };
                            setQuestionSubmitted(next);
                            persistAttemptIfFinished(next);
                          }}
                          className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90"
                        >
                          Submit Response
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {mode === "quiz" && (
                  <div className="space-y-3">
                    <textarea
                      rows={6}
                      className="w-full rounded-lg bg-black/40 border border-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder={current.placeholder || "Type your answer..."}
                      value={answers[current.id] || ""}
                      onChange={(e) => handleAnswer(current.id, e.target.value)}
                    />
                    {Array.isArray(current.checklist) && (
                      <div className="text-sm text-gray-400">
                        <span className="block mb-1 text-gray-300">Checklist:</span>
                        <ul className="list-disc ml-5">
                          {current.checklist.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Per-question submit for quiz */}
                    {!questionSubmitted[current.id] && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            const next = { ...(questionSubmitted || {}), [current.id]: true };
                            setQuestionSubmitted(next);
                            persistAttemptIfFinished(next);
                          }}
                          className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90"
                        >
                          Submit Response
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer controls */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      disabled={!canPrev}
                      onClick={() => canPrev && setCurrentIndex((i) => i - 1)}
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        canPrev ? "border-gray-700 hover:bg-white/5" : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <button
                      disabled={!canNext}
                      onClick={() => {
                        if (!questionSubmitted[current.id]) submitCurrentQuestion();
                        if (canNext) setCurrentIndex((i) => i + 1);
                      }}
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        canNext ? "border-gray-700 hover:bg-white/5" : "border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {submitted ? (
                      <>
                        <button
                          onClick={() => {
                            const el = document.getElementById("results-block");
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-white/5"
                        >
                          View Results
                        </button>
                        <button
                          onClick={restart}
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-white/5"
                        >
                          <RotateCcw size={16} /> Try Again
                        </button>
                      </>
                    ) : (
                      /* Show a final "Submit Round" button on the last question as a fallback */
                      (currentIndex === questions.length - 1 && !questionSubmitted[current?.id]) ? (
                        <button
                          onClick={() => {
                            // mark all questions submitted and persist
                            const allMap = {};
                            questions.forEach((q) => { allMap[q.id] = true; });
                            setQuestionSubmitted(allMap);
                            persistAttemptIfFinished(allMap);
                            // scroll to results once saved
                            setTimeout(() => {
                              const el = document.getElementById('results-block');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 300);
                          }}
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-95"
                        >
                          Submit Round
                        </button>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            ) : (
              mode ? <InterviewRoomSkeleton /> : <div className="text-gray-400">No questions found for this selection.</div>
            )}

            {/* Results */}
            {submitted && (
              <div id="results-block" className="mt-6 bg-white/5 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                {mode === "mcq" && (() => {
                  let correct = 0;
                  questions.forEach((q) => {
                    const map = optionMap[q.id] || { answerIndex: q.answerIndex };
                    if (typeof answers[q.id] === 'number' && answers[q.id] === map.answerIndex) correct += 1;
                  });
                  const percent = Math.round((correct / questions.length) * 100);
                  return (
                    <div className="text-gray-300">
                      Score: <span className="text-purple-300 font-semibold">{correct}/{questions.length}</span> ({percent}%)
                    </div>
                  );
                })()}
                {mode !== "mcq" && (
                  <div className="text-gray-400 text-sm">
                    Submitted. Review your answers against the checklist/rubric above.
                  </div>
                )}
              </div>
            )}

            {/* Post-Interview Report */}
            {submitted && (() => {
              const rptRaw = (() => { try { return JSON.parse(localStorage.getItem('last_report_v1')||'null'); } catch { return null; } })();
              const scores = rptRaw?.scores || { correctness: 0, clarity: 0, structure: 0 };
              const strengths = rptRaw?.strengths || [];
              const weaknesses = rptRaw?.weaknesses || [];
              const resources = rptRaw?.resources || [];
              const Bar = ({ value }) => (
                <div className="w-full h-2 bg-gray-800 rounded overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{width: `${value}%`}} /></div>
              );
              return (
                <div className="mt-6 bg-white/5 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Post-Interview Report</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1"><span>Correctness</span><span>{scores.correctness}%</span></div>
                      <Bar value={scores.correctness} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1"><span>Clarity</span><span>{scores.clarity}%</span></div>
                      <Bar value={scores.clarity} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1"><span>Structure</span><span>{scores.structure}%</span></div>
                      <Bar value={scores.structure} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 border border-gray-800 rounded-xl p-4">
                      <div className="font-semibold mb-2">Strengths</div>
                      {strengths.length === 0 ? <div className="text-gray-400 text-sm">No strong areas yet. Keep practicing!</div> : (
                        <ul className="list-disc ml-5 text-sm">{strengths.map((s,i)=>(<li key={i}>{s}</li>))}</ul>
                      )}
                    </div>
                    <div className="bg-white/5 border border-gray-800 rounded-xl p-4">
                      <div className="font-semibold mb-2">Weaknesses</div>
                      {weaknesses.length === 0 ? <div className="text-gray-400 text-sm">Great balance across dimensions.</div> : (
                        <ul className="list-disc ml-5 text-sm">{weaknesses.map((w,i)=>(<li key={i}>{w}</li>))}</ul>
                      )}
                    </div>
                  </div>
                  {resources.length > 0 && (
                    <div className="mt-6">
                      <div className="font-semibold mb-2">Suggested Resources</div>
                      <ul className="list-disc ml-5 text-sm space-y-1">
                        {resources.map((r, i) => (
                          <li key={i}><a className="text-blue-400 hover:text-blue-300 underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Practice Plan Preview */}
            {submitted && (() => {
              const plan = (() => { try { return JSON.parse(localStorage.getItem('practice_plan_v1')||'null'); } catch { return null; } })();
              if (!plan?.entries?.length) return null;
              return (
                <div className="mt-6 bg-white/5 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-3">Practice Plan (Spaced Repetition)</h3>
                  <div className="text-sm text-gray-300 mb-3">We scheduled quick drills for your weak topics.</div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    {plan.entries.map((e, idx) => (
                      <div key={idx} className="bg-black/30 border border-gray-800 rounded-xl p-3">
                        <div className="font-semibold mb-2">{e.topic}</div>
                        <ul className="space-y-1">
                          {e.due.map((d,i)=>(<li key={i} className="text-gray-400">Session {i+1}: {new Date(d).toLocaleDateString()} </li>))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}


