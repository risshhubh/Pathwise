# TODO: Make Interview Progress User-Specific

## Step 1: Create InterviewAttempt Model ✅
- Create `backend/models/InterviewAttempt.js` with schema: userId, type, mode, timestamp, scorePercent, answers, report, plan.

## Step 2: Create Progress Routes ✅
- Create `backend/routes/progressRoutes.js` with POST /api/progress/save-attempt and GET /api/progress/attempts, protected by auth middleware.
- Update user's interviewsCompleted and averageScore in save route.

## Step 3: Update User Model ✅
- Ensure User.js supports stats updates (already has fields, may need minor adjustments).

## Step 4: Modify InterviewRoom.jsx
- Import useAuth from AuthContext. ✅
- Replace localStorage with API calls: fetch attempts on load, save on finish.
- Handle loading states.

## Step 5: Update Backend Server ✅
- Add progress routes to `backend/server.js`.

## Followup Steps
- Test with multiple users: Login as A, complete interview, logout. Login as B, verify no shared progress.
- Run backend and frontend, ensure API calls work.
- Update dashboard if needed (out of scope for now).
