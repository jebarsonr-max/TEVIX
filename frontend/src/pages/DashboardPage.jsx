import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  teamsApi,
  studentsApi,
  requestsApi
} from '../services/api';
import {
  Users,
  Compass,
  Sparkles,
  Flame,
  Activity,
  Award,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  UserPlus,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TeamGapPanel } from '../components/TeamGapPanel';
import { TeamDNAPanel } from '../components/TeamDNAPanel';
import { TeamRiskPanel } from '../components/TeamRiskPanel';
import { ReadinessScore } from '../components/ReadinessScore';
import { TeamBalanceCard } from '../components/TeamBalanceCard';
import { CandidateCard } from '../components/CandidateCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { MatchBreakdown } from '../components/MatchBreakdown';

export function DashboardPage() {
  const { user, profile, activeTeam, userTeams } = useAuth();
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);

  // Simulation & Why modals
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [activeWhyMatch, setActiveWhyMatch] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setLoading(true);
      try {
        if (activeTeam?.id) {
          // Fetch full team with analytics
          const teamRes = await teamsApi.getTeamById(activeTeam.id);
          setTeamData(teamRes);

          // Fetch top candidates scored against this team
          const candRes = await studentsApi.getStudents({ teamId: activeTeam.id });
          setTopMatches((candRes.students || []).slice(0, 3));
        }

        // Fetch requests
        const reqRes = await requestsApi.getRequests();
        setRequests(reqRes);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user, activeTeam]);

  // Request sender helper
  async function handleSendRequest(candidate) {
    if (!activeTeam) {
      alert('Please select or create an active team first.');
      return;
    }
    try {
      await requestsApi.sendRequest({
        teamId: activeTeam.id,
        receiverProfileId: candidate.id,
        requestType: 'team_invite',
        message: `Hi ${candidate.full_name}, we'd love for you to join ${activeTeam.name}!`
      });
      alert(`Teammate invitation sent to ${candidate.full_name}!`);
      // Refresh requests
      const reqRes = await requestsApi.getRequests();
      setRequests(reqRes);
    } catch (err) {
      alert(err.message || 'Failed to send request.');
    }
  }

  if (loading) {
    return <LoadingState message="Computing live team vectors and gap metrics..." />;
  }

  // If user has no teams yet
  if (!activeTeam || !teamData) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Hacker'}
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Get Started with TEVIX
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              You haven't created or joined an active hackathon team yet. Create your team or browse candidates to begin optimizing your team composition.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/teams/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Hackathon Team</span>
            </Link>

            <Link
              to="/students"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Candidates</span>
            </Link>
          </div>
        </div>

        {/* Requests Preview if any */}
        {requests.incoming.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Pending Invitations ({requests.incoming.length})
            </h3>
            <p className="text-xs text-slate-400">You have incoming teammate requests waiting for response.</p>
            <Link to="/requests" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1">
              View Requests <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  const { team, analytics } = teamData;
  const topCandidate = topMatches[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. WELCOME & QUICK METRICS HEADER */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
              <span>Smart India Hackathon 2026</span>
              <span>•</span>
              <span className="text-slate-400">{team.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Leader'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {analytics.summary}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 shrink-0">
            {/* Team Balance */}
            <div className="px-3 py-1.5 border-r border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Team Balance</span>
              <span className={`text-2xl font-black ${
                analytics.teamBalanceScore >= 80 ? 'text-emerald-400' :
                analytics.teamBalanceScore >= 65 ? 'text-indigo-400' :
                analytics.teamBalanceScore >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {analytics.teamBalanceScore}%
              </span>
            </div>

            {/* Hackathon Readiness */}
            <div className="px-3 py-1.5 border-r border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Readiness</span>
              <span className="text-2xl font-black text-indigo-400">
                {analytics.hackathonReadinessScore}%
              </span>
            </div>

            {/* Team Members */}
            <div className="px-3 py-1.5 border-r border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Members</span>
              <span className="text-2xl font-black text-white">
                {team.members.length} <span className="text-xs text-slate-500 font-normal">/ {team.max_size}</span>
              </span>
            </div>

            {/* Biggest Gap */}
            <div className="px-3 py-1.5">
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">Biggest Gap</span>
              <span className="text-sm font-extrabold text-white truncate block max-w-[110px]" title={analytics.biggestGap}>
                {analytics.biggestGap}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY NOVEL FEATURE: TEAM GAP INTELLIGENCE PANEL */}
      <TeamGapPanel
        gaps={analytics.gaps}
        onFindTeammatesClick={() => navigate(`/students?role=${encodeURIComponent(analytics.biggestGap || '')}`)}
      />

      {/* 3. STAR RECOMMENDATION SPOTLIGHT */}
      {topCandidate && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-800/50 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Top Complementary Match
              </div>
              <h3 className="text-xl font-bold text-white">
                {topCandidate.full_name} — {topCandidate.match?.totalScore}% Team Match
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {topCandidate.department} • Year {topCandidate.year} • {topCandidate.roles?.[0]?.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Team Impact: +{topCandidate.match?.teamImpactDelta}%
              </span>

              <button
                onClick={() => setActiveSimulation(topCandidate)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Simulate Addition
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Why Recommended?
              </span>
              <p className="text-slate-200">
                {topCandidate.match?.whyPoints?.[0] || 'Directly fills team technical void.'}
              </p>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Primary Skills Offered
              </span>
              <p className="text-slate-200 truncate">
                {topCandidate.skills?.map(s => s.name).join(', ')}
              </p>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">
                  Availability
                </span>
                <span className="text-slate-200 font-medium">
                  {topCandidate.availability?.days} ({topCandidate.availability?.hoursPerWeek || 15} hrs/wk)
                </span>
              </div>
              <button
                onClick={() => handleSendRequest(topCandidate)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TEAM DNA & HACKATHON READINESS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamDNAPanel
          dnaData={analytics.dna}
          teamBalanceScore={analytics.teamBalanceScore}
          explanation={analytics.summary}
        />

        <ReadinessScore
          readiness={analytics.readiness}
        />
      </div>

      {/* 5. TEAM RISKS & TOP CANDIDATES CAROUSEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risks */}
        <div className="lg:col-span-1">
          <TeamRiskPanel risks={analytics.risks} />
        </div>

        {/* Recommended Teammates List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Recommended Teammates for {team.name}
              </h3>
              <p className="text-xs text-slate-400">
                Ranked using Skill Complementarity and Transparent Weighted Matching
              </p>
            </div>

            <Link
              to="/students"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All Candidates <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topMatches.map(cand => (
              <CandidateCard
                key={cand.id}
                candidate={cand}
                onSimulate={(c) => setActiveSimulation(c)}
                onWhyMatch={(c) => setActiveWhyMatch(c)}
                onSendRequest={(c) => handleSendRequest(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SIMULATION MODAL */}
      {activeSimulation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8">
            <div className="text-right mb-2">
              <button
                onClick={() => setActiveSimulation(null)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Close Simulator
              </button>
            </div>
            <WhatIfSimulator
              simulation={{
                candidateName: activeSimulation.full_name,
                before: {
                  teamBalanceScore: analytics.teamBalanceScore,
                  readinessScore: analytics.hackathonReadinessScore
                },
                after: {
                  teamBalanceScore: Math.min(analytics.teamBalanceScore + (activeSimulation.match?.teamImpactDelta || 15), 98),
                  readinessScore: Math.min(analytics.hackathonReadinessScore + 18, 97)
                },
                improvement: {
                  balanceDelta: `+${activeSimulation.match?.teamImpactDelta || 18}%`,
                  readinessDelta: '+18%'
                },
                pillarShifts: {
                  'Backend': {
                    before: analytics.dna['Backend']?.score || 0,
                    after: activeSimulation.skills?.some(s => ['Python', 'Node.js', 'SQL'].includes(s.name)) ? 95 : 40,
                    delta: activeSimulation.skills?.some(s => ['Python', 'Node.js', 'SQL'].includes(s.name)) ? 95 : 40
                  },
                  'AI/ML': {
                    before: analytics.dna['AI/ML']?.score || 0,
                    after: activeSimulation.skills?.some(s => ['Machine Learning', 'TensorFlow', 'PyTorch'].includes(s.name)) ? 90 : 20,
                    delta: activeSimulation.skills?.some(s => ['Machine Learning', 'TensorFlow', 'PyTorch'].includes(s.name)) ? 90 : 20
                  },
                  'Database': {
                    before: analytics.dna['Database']?.score || 0,
                    after: activeSimulation.skills?.some(s => ['SQL', 'PostgreSQL', 'MongoDB'].includes(s.name)) ? 85 : 30,
                    delta: activeSimulation.skills?.some(s => ['SQL', 'PostgreSQL', 'MongoDB'].includes(s.name)) ? 85 : 30
                  }
                },
                explanation: `Adding ${activeSimulation.full_name} drastically eliminates your team's capability deficits and lifts total hackathon balance by +${activeSimulation.match?.teamImpactDelta || 18}%.`
              }}
            />
          </div>
        </div>
      )}

      {/* WHY MATCH MODAL */}
      {activeWhyMatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full my-8">
            <div className="text-right mb-2">
              <button
                onClick={() => setActiveWhyMatch(null)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
            <MatchBreakdown match={activeWhyMatch.match} />
          </div>
        </div>
      )}
    </div>
  );
}
