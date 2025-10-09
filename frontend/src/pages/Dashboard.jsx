"use client";
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

// --- Mock Data (replace with actual data from your backend) ---
const performanceData = [
  { name: "Interview 1", score: 65 },
  { name: "Interview 2", score: 72 },
  { name: "Interview 3", score: 70 },
  { name: "Interview 4", score: 81 },
  { name: "Interview 5", score: 85 },
  { name: "Interview 6", score: 92 },
];

const recentInterviews = [
  {
    id: 1,
    type: "Technical",
    role: "Frontend Developer",
    date: "2 days ago",
    score: 92,
  },
  {
    id: 2,
    type: "Behavioral",
    role: "Product Manager",
    date: "4 days ago",
    score: 85,
  },
  {
    id: 3,
    type: "System Design",
    role: "Backend Engineer",
    date: "1 week ago",
    score: 81,
  },
];
// --- End of Mock Data ---

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

  const handleStartMockInterview = () => {
    navigate("/interview");
  };

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

            {/* Recent Activity */}
            <DashboardCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Book className="mr-3 h-5 w-5 text-purple-400" />
                Recent Activity
              </h2>
              <ul className="space-y-4">
                {recentInterviews.map((interview) => (
                  <li
                    key={interview.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{interview.type} Interview</p>
                      <p className="text-sm text-gray-400">
                        {interview.role} • {interview.date}
                      </p>
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
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors cursor-pointer"
                  onClick={handleStartMockInterview}
                >
                  <Bot className="h-5 w-5" />
                  Start AI Mock Interview
                </button>
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors cursor-pointer">
                  <FileText className="h-5 w-5" />
                  Go to Resume Builder
                </button>
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
                  <span className="font-bold">6</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Average Score</span>
                  <span className="font-bold">81%</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Hours Practiced</span>
                  <span className="font-bold">12.5</span>
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