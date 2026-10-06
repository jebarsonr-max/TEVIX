# TEVIX — Hackathon Teammate Finder

> **"Build the right team, not just a team."**

---

## 🌟 Executive Summary

> **"TEVIX is not a student directory. It is a team composition intelligence platform that analyzes what a team is missing, identifies complementary candidates, explains why they are suitable, and predicts how each candidate improves the team's overall hackathon readiness."**

Most teammate-finding platforms help students search for people based on raw keywords. **TEVIX solves a deeper structural problem: understanding team capability deficits.** 

Through its **Team Gap Intelligence**, **Skill Complementarity Engine**, **11-Dimension Team DNA**, **What-If Simulator**, and **Hackathon Readiness Model**, TEVIX ensures hackathon teams form with optimal cross-functional coverage, minimizing redundancy and maximizing project success.

---

## 🚀 Novel Features

| Feature | Description | Novelty & Impact |
| :--- | :--- | :--- |
| **1. Team Gap Intelligence** | Automatically analyzes current team members and identifies missing technical skills, missing roles, missing project capabilities, and skill redundancies. | Transforms search from keyword matching into deficit-driven recommendations (e.g., recommends AI/ML or Backend when only Frontend and Design exist). |
| **2. Skill Complementarity Engine** | Formula: $\text{Similarity} + \text{Complementarity} + \text{Required Match} = \text{Team Value}$. | Candidates with complementary capabilities receive higher rankings over candidates with redundant skills already in the team. |
| **3. Explainable Matching** | Transparent 100-point breakdown across 6 dimensions plus dynamic natural language "Why?" bullet points. | Eliminates black-box scores; students see exact reasons why a candidate matches their team. |
| **4. 11-Dimension Team DNA** | Evaluates team capabilities across: Frontend, Backend, AI/ML, Database, UI/UX, Cloud, Cybersecurity, IoT, Research, Presentation, Leadership. | Visualizes complete technical vector and computes harmonic **Team Balance Score**. |
| **5. What-If Team Simulator** | Simulates adding a candidate to the team before sending an invitation. | Computes actual live Before vs. After Team Balance (e.g., 50% $\to$ 94%, $+44\%$), pillar shifts, and readiness lift. |
| **6. Hackathon Readiness Score** | Multi-factor index: Technical Coverage (30%), Role Coverage (20%), Complementarity (20%), Experience (10%), Availability (10%), Team Balance (10%). | Generates concrete readiness score (0-100) and actionable next steps. |
| **7. Team Risk Detector** | Real-time audit detecting HIGH, MEDIUM, and LOW operational risks (e.g., single-person backend bottlenecks, zero past hackathons, roster under-capacity). | Preempts common hackathon project failure modes. |
| **8. Build My Ideal Team** | Automated roster synthesizer that curates a multi-role dream team from available candidates. | Instant generation of optimal rosters with predicted team balance and readiness. |

---

## 🏗️ Architecture & Tech Stack

```
                        TEVIX ARCHITECTURE
  
 [ React 19 + Vite + Tailwind CSS ]  <--- Modern, Responsive SPA Frontend
                  │
                  ▼ HTTP / REST APIs
 [ Express 5 REST API Server ]       <--- Controller & Service Architecture
                  │
  ┌───────────────┴─────────────────────────────────────────┐
  │                   TEVIX INTELLIGENCE ENGINES            │
  │ • teamGapEngine.js       • teamDnaEngine.js             │
  │ • matchingEngine.js      • simulatorEngine.js           │
  │ • readinessEngine.js     • riskDetectorEngine.js        │
  │ • idealTeamEngine.js     • pillarMap.js                 │
  └───────────────┬─────────────────────────────────────────┘
                  │
                  ▼ SQLite (WAL Mode, Foreign Keys)
 [ Relational SQLite Database (tevix.db) ]
```

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, React Router DOM
- **Backend**: Node.js, Express 5, Better-SQLite3, JSON Web Tokens (JWT), bcryptjs
- **Database**: SQLite with strict relational foreign keys and WAL performance mode

---

## 🗄️ Database Design

```sql
users                  (id, email, password_hash, created_at)
profiles               (id, user_id, full_name, avatar_url, department, year, gender, 
                        contact_preference, experience_level, hackathons_count, github_url, 
                        linkedin_url, bio, created_at, updated_at)
skills                 (id, name, category)
student_skills         (id, profile_id, skill_id, proficiency)
roles                  (id, name, category)
student_roles          (id, profile_id, role_id, is_primary)
availability           (id, profile_id, days, time_slots, hours_per_week)
hackathons             (id, name, description, category, start_date, end_date, team_size_min, team_size_max)
teams                  (id, leader_id, hackathon_id, name, description, max_size, status, created_at)
team_members           (id, team_id, profile_id, role_in_team, joined_at)
team_requirements      (id, team_id, department_preference, gender_requirement, 
                        experience_requirement, preferred_availability, notes)
team_required_skills   (id, team_id, skill_id)
team_required_roles    (id, team_id, role_id)
requests               (id, team_id, sender_profile_id, receiver_profile_id, request_type, status, message)
```

---

## 📊 Transparent Weighted Matching Algorithm

The matching engine scores candidates against teams on a 100-point scale:

$$\text{Total Score} = S_{\text{Skill}} (35\%) + R_{\text{Role}} (25\%) + E_{\text{Experience}} (15\%) + A_{\text{Availability}} (10\%) + D_{\text{Department}} (10\%) + I_{\text{Interest}} (5\%)$$

### Match Categories:
- **90 – 100**: Excellent Match
- **75 – 89**: Strong Match
- **60 – 74**: Potential Match
- **Below 60**: Low Match

### Complementarity Factor:
Unlike naive similarity searches, candidate scores receive positive bonuses for covering deficient team pillars (Backend, AI/ML, Database, Cloud) and penalties when introducing only redundant skills.

---

## 💡 Engineering Decisions & Rationale

1. **Why React?**
   Component-based architecture makes it easy to build reusable UI elements (e.g., `CompatibilityScore`, `TeamGapPanel`, `WhatIfSimulator`) and maintain predictable client-side state across tabs.
2. **Why Tailwind CSS?**
   Enables rapid, polished, and responsive UI development with utility classes, zero stylesheet bloat, and consistent design language across desktop and mobile.
3. **Why Node.js + Express?**
   Unifies JavaScript across both frontend and backend, enabling rapid JSON REST API endpoints and zero runtime impedance mismatches.
4. **Why SQLite via Better-SQLite3?**
   Lightweight, serverless relational database with zero setup overhead for hackathons. `better-sqlite3` runs synchronously with extreme speed and supports foreign key constraints and WAL mode.
5. **Why REST APIs?**
   Enforces a clean separation between frontend and backend, simplifies integration testing, and allows independent scalability.
6. **Why Weighted Matching?**
   Deterministic, transparent, and explainable. Candidates and team leaders can see the exact breakdown across 6 factors rather than guessing how a score was formed.
7. **Why Not a Complex ML Model?**
   A hackathon platform requires determinism, reliability, and explainable justifications without requiring cold-start training datasets or introducing probabilistic hallucinations.
8. **Why Team Complementarity?**
   A successful hackathon team requires complementary functional specializations (UI + Backend + ML + Pitch), not 4 people who only know Frontend.
9. **Why Explainable Matching?**
   Students need actionable clarity on *why* someone is suitable before sending invitations.
10. **Why Team Gap Intelligence?**
    It elevates TEVIX from a passive student directory into a proactive team composition intelligence platform.

---

## 🔑 Demo Credentials & Scenarios

All accounts use the password: `password123`

| Persona | Email | Role / State | Highlight / Test Scenario |
| :--- | :--- | :--- | :--- |
| **Arjun Kumar** | `arjun@tevix.dev` | Team Leader, Team Quantum Leap (CSE, Frontend) | Evaluates Team Quantum Leap with Priya (Design) and Rahul (Pitch). Identifies missing Backend & AI/ML gaps. |
| **Kavin Raj** | `kavin@tevix.dev` | Candidate (CSE, Backend Developer) | High complementarity match (**92% Match**, $+44\%$ Team Lift). Adds Python, SQL, and Node.js. |
| **Divya Menon** | `divya@tevix.dev` | Candidate (AI & DS, AI/ML Engineer) | Top AI match (**86% Match**). Adds PyTorch, TensorFlow, and Computer Vision models. |
| **Priya Sharma** | `priya@tevix.dev` | Member, Team Quantum Leap (IT, UI/UX Designer) | Member perspective on the team dashboard. |
| **Pooja Joshi** | `pooja@joshi.dev` | Candidate (CSE, Frontend Developer) | **Redundant Profile**: Only offers React & CSS. Scored as **Low Match (46%)** to verify complementarity ranking. |

---

## 🛠️ CLI Commands & Installation

### Prerequisites
- Node.js $\ge$ 18.x
- npm $\ge$ 9.x

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds 24 students, demo team, hackathons, and requests
npm start        # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

### 3. Automated Test Suite Execution
```bash
cd backend
node test-backend.js   # Tests all engine algorithms & DB integration
node test-e2e-api.js   # Runs 10-step full REST API test suite
```

### 4. Production Build Verification
```bash
cd frontend
npm run build          # Builds production bundle cleanly in ~400ms
```

---

## 🔌 API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student profile | No |
| `POST` | `/api/auth/login` | Login and acquire JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated session profile | Yes |
| `GET` | `/api/profile` | Get current student profile | Yes |
| `PUT` | `/api/profile` | Update profile vector, skills, and availability | Yes |
| `GET` | `/api/students` | Discover candidates with multi-factor filters | Optional |
| `GET` | `/api/students/:id` | View candidate profile, match, and simulation | Optional |
| `POST` | `/api/teams` | Create new hackathon team | Yes |
| `GET` | `/api/teams` | List hackathon teams | Optional |
| `GET` | `/api/teams/:id` | Get full team cockpit details & analytics | Optional |
| `PUT` | `/api/teams/:id` | Update team details and requirements | Yes |
| `GET` | `/api/teams/:id/gaps` | Run Team Gap Intelligence on team | Optional |
| `GET` | `/api/teams/:id/dna` | Calculate 11-dimension Team DNA | Optional |
| `GET` | `/api/teams/:id/balance` | Calculate Team Balance Score & explanation | Optional |
| `GET` | `/api/teams/:id/readiness` | Calculate Hackathon Readiness Score | Optional |
| `GET` | `/api/teams/:id/risks` | Detect HIGH/MEDIUM/LOW team risks | Optional |
| `GET` | `/api/teams/:id/simulate/:candidateId` | Simulate candidate addition (Before vs After) | Optional |
| `DELETE` | `/api/teams/:id/members/:memberId` | Remove member from team | Yes |
| `POST` | `/api/requests` | Send teammate invitation or join request | Yes |
| `GET` | `/api/requests` | Fetch incoming and outgoing teammate requests | Yes |
| `PUT` | `/api/requests/:id` | Accept, reject, or cancel request | Yes |
| `POST` | `/api/ideal-team` | Synthesize optimal multi-role dream team | No |
| `GET` | `/api/metadata` | Fetch all skills, roles, and hackathons | No |
| `GET` | `/api/health` | Service health status check | No |

---

## 🔮 Future Roadmap

- Real-time WebSocket chat between teammates during recruitment.
- Integration with GitHub API to verify commit frequency and pull request volume.
- Hackathon schedule calendar synchronizer with Google Calendar API.
