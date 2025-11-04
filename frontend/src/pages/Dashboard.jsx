"use client";
import React, { useEffect, useState } from "react";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Book,
  Bot,
  FileText,
  LayoutGrid,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Data helpers (derived from stored attempts) ---
function loadAttempts() {
  try {
    const raw = localStorage.getItem("interview_attempts_v1");
    const arr = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(arr) ? arr : [];
    // Dedupe by composite key (type|mode|timestamp rounded to nearest second)
    const seen = new Set();
    const deduped = [];
    for (const a of list) {
      const key = `${a.type}|${a.mode}|${Math.round((a.timestamp || 0)/1000)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(a);
    }
    return deduped;
  } catch {
    return [];
  }
}

function aggregateByType(attempts) {
  const types = ["technical", "behavioral", "system-design"];
  const agg = Object.fromEntries(types.map((t) => [t, { count: 0, scores: [] }]));
  attempts.forEach((a) => {
    if (!agg[a.type]) return;
    agg[a.type].count += 1;
    if (typeof a.scorePercent === "number") agg[a.type].scores.push(a.scorePercent);
  });
  const typeAverages = types.map((t) => {
    const item = agg[t];
    const avg = item.scores.length
      ? Math.round(item.scores.reduce((s, v) => s + v, 0) / item.scores.length)
      : 0; // 0 if no progress
    const label = t === "system-design" ? "System Design" : t.charAt(0).toUpperCase() + t.slice(1);
    return { type: t, label, average: avg, attempts: item.count };
  });
  return typeAverages;
}

function recentFromAttempts(attempts) {
  const last = [...attempts]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map((a, i) => ({
      id: i + 1,
      type: a.type === "system-design" ? "System Design" : a.type.charAt(0).toUpperCase() + a.type.slice(1),
      date: new Date(a.timestamp).toLocaleString(),
      score: typeof a.scorePercent === "number" ? a.scorePercent : "—",
    }));
  return last;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// A reusable card component for the dashboard widgets
const DashboardCard = ({ children, className }) => (
  <motion.div
    variants={itemVariants}
    className={`bg-white/5 border border-gray-800 rounded-2xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.name || "there";
  const navigate = useNavigate();

  // Load attempts and keep them reactive on local changes and custom events
  const [attempts, setAttempts] = useState(() => loadAttempts());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'interview_attempts_v1') setAttempts(loadAttempts());
    };
    const onUpdated = () => setAttempts(loadAttempts());
    window.addEventListener('storage', onStorage);
    window.addEventListener('attempts-updated', onUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('attempts-updated', onUpdated);
    };
  }, []);

  const typeAgg = aggregateByType(attempts);
  const recentInterviews = recentFromAttempts(attempts);
  const overallScores = attempts.filter(a => typeof a.scorePercent === 'number').map(a => a.scorePercent);
  const overallAverage = overallScores.length ? Math.round(overallScores.reduce((s,v)=>s+v,0)/overallScores.length) : 0;
  const totalInterviews = attempts.length;

  // Time-series of last scored attempts for the chart
  const lastScores = overallScores.slice(-8);
  const startIndex = overallScores.length - lastScores.length;
  const performanceData = lastScores.map((score, idx) => ({ name: `Attempt ${startIndex + idx + 1}`, score }));

  // Hydration flag for skeleton fallback
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 sm:p-6 lg:p-8 mt-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-400 mt-1">
            Let's get you ready for your next big opportunity.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Performance Chart */}
            <DashboardCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-3 h-5 w-5 text-purple-400" />
                Performance Overview
              </h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        borderColor: "#4b5563",
                        backdropFilter: "blur(4px)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#a78bfa"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#8b5cf6" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            {/* Recent Activity (real attempts only; empty -> 0 progress) */}
            <DashboardCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Book className="mr-3 h-5 w-5 text-purple-400" />
                Recent Activity
              </h2>
              <ul className="space-y-4">
                {recentInterviews.length === 0 && (
                  <li className="p-3 bg-white/5 rounded-lg text-gray-400">No interviews yet.</li>
                )}
                {recentInterviews.map((interview) => (
                  <li
                    key={interview.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{interview.type} Interview</p>
                      <p className="text-sm text-gray-400">{interview.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-purple-400">
                        {interview.score}
                      </p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <DashboardCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <LayoutGrid className="mr-3 h-5 w-5 text-purple-400" />
                Interview Strengths
              </h2>
              <div className="space-y-4">
                {typeAgg.map((t) => (
                  <div key={t.type} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="font-medium">{t.label}</div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold">{t.average}%</div>
                      <div className="text-xs text-gray-500">{t.attempts} {t.attempts === 1 ? 'attempt' : 'attempts'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
            <DashboardCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart className="mr-3 h-5 w-5 text-purple-400" />
                Your Stats
              </h2>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="text-gray-400">Interviews Completed</span>
                  <span className="font-bold">{totalInterviews}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Average Score</span>
                  <span className="font-bold">{overallAverage}%</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Hours Practiced</span>
                  <span className="font-bold">0</span>
                </p>
              </div>
            </DashboardCard>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
}