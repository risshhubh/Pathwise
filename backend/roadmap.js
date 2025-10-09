// roadmap.js

// --- MOCK DATABASE ---
// In a real app, this would be replaced with calls to a database like MongoDB or PostgreSQL.
let roadmapData = {
  phases: [
    {
      id: 0,
      title: "Phase 1: Foundations & Frontend",
      duration: "4 Weeks",
      milestones: [
        { text: "Master HTML & CSS", done: true },
        { text: "Learn Modern JavaScript (ES6+)", done: true },
        { text: "Build 3 Projects with React", done: false },
        { text: "Understand State Management (Context API)", done: false },
      ],
      skills: [
        { name: "React", level: 60 },
        { name: "JavaScript", level: 85 },
        { name: "Tailwind CSS", level: 75 },
      ],
    },
    {
      id: 1,
      title: "Phase 2: Backend Development with Node.js",
      duration: "4 Weeks",
      milestones: [
        { text: "Setup a Node.js & Express Server", done: false },
        { text: "Design a RESTful API", done: false },
        { text: "Connect to a MongoDB Database", done: false },
        { text: "Implement User Authentication", done: false },
      ],
      skills: [
        { name: "Node.js", level: 20 },
        { name: "Express.js", level: 15 },
        { name: "MongoDB", level: 5 },
      ],
    },
    {
        id: 2,
        title: "Phase 3: Advanced Concepts & Deployment",
        duration: "3 Weeks",
        milestones: [
          { text: "Learn about WebSockets for real-time features", done: false },
          { text: "Containerize the app with Docker", done: false },
          { text: "Deploy the full-stack application", done: false },
        ],
        skills: [
          { name: "WebSockets", level: 0 },
          { name: "Docker", level: 0 },
        ],
      },
  ],
};

/**
 * Calculates the current stats based on the roadmap data.
 * @param {object} data - The roadmap data object.
 * @returns {object} - The calculated stats.
 */
const calculateStats = (data) => {
    const allMilestones = data.phases.flatMap(p => p.milestones);
    const milestonesDone = allMilestones.filter(m => m.done).length;
    const totalMilestones = allMilestones.length;
    const completion = totalMilestones > 0 ? milestonesDone / totalMilestones : 0;
    return {
        milestonesDone,
        totalMilestones,
        completion: parseFloat(completion.toFixed(2)),
        streak: 5, // Example static streak, could be calculated from a user profile
    };
};

/**
 * Retrieves the complete, formatted roadmap data with stats.
 * @returns {object}
 */
export const getRoadmapData = () => {
    return {
        phases: roadmapData.phases,
        stats: calculateStats(roadmapData),
    };
};

/**
 * Toggles the 'done' status of a specific milestone.
 * @param {number} phaseId - The ID of the phase.
 * @param {number} milestoneIndex - The index of the milestone within the phase.
 * @returns {object|null} - The updated roadmap data or null if not found.
 */
export const toggleMilestoneStatus = (phaseId, milestoneIndex) => {
    const phase = roadmapData.phases.find(p => p.id === phaseId);
    if (phase && phase.milestones[milestoneIndex] !== undefined) {
      phase.milestones[milestoneIndex].done = !phase.milestones[milestoneIndex].done;
      return getRoadmapData(); // Return the complete data with updated stats
    }
    return null; // Indicate that the milestone was not found
};
