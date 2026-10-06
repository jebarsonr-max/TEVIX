import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentsApi, requestsApi, metadataApi } from '../services/api';
import { CandidateCard } from '../components/CandidateCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { MatchBreakdown } from '../components/MatchBreakdown';
import { Search, Filter, SlidersHorizontal, Sparkles, X, Users } from 'lucide-react';

export function StudentsPage() {
  const { user, activeTeam } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [metadata, setMetadata] = useState({ skills: [], roles: [] });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [year, setYear] = useState(searchParams.get('year') || 'All');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [role, setRole] = useState(searchParams.get('role') || 'All');
  const [skill, setSkill] = useState(searchParams.get('skill') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'All');
  const [availabilityDays, setAvailabilityDays] = useState(searchParams.get('availabilityDays') || 'All');
  const [minScore, setMinScore] = useState(searchParams.get('minScore') || '');

  // Modals
  const [simulationData, setSimulationData] = useState(null);
  const [simulationCandidate, setSimulationCandidate] = useState(null);
  const [whyMatchData, setWhyMatchData] = useState(null);

  // Sent requests tracker
  const [sentRequestIds, setSentRequestIds] = useState(new Set());

  useEffect(() => {
    metadataApi.getMetadata().then(setMetadata).catch(console.error);
  }, []);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const params = {
          teamId: activeTeam?.id,
          search: search || undefined,
          department: department !== 'All' ? department : undefined,
          year: year !== 'All' ? year : undefined,
          gender: gender !== 'All' ? gender : undefined,
          role: role !== 'All' ? role : undefined,
          skill: skill !== 'All' ? skill : undefined,
          experienceLevel: experienceLevel !== 'All' ? experienceLevel : undefined,
          availabilityDays: availabilityDays !== 'All' ? availabilityDays : undefined,
          minScore: minScore || undefined
        };

        const res = await studentsApi.getStudents(params);
        setStudents(res.students || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [activeTeam, search, department, year, gender, role, skill, experienceLevel, availabilityDays, minScore]);

  async function handleSimulate(candidate) {
    if (!activeTeam) {
      alert('Please select or create an active team to simulate additions.');
      return;
    }
    try {
      const res = await studentsApi.getStudentById(candidate.id, activeTeam.id);
      if (res.simulation) {
        setSimulationData(res.simulation);
        setSimulationCandidate(candidate);
      } else {
        alert('Simulation metrics unavailable for this candidate.');
      }
    } catch (err) {
      alert('Failed to simulate addition: ' + err.message);
    }
  }

  function handleWhyMatch(candidate) {
    if (candidate.match) {
      setWhyMatchData(candidate.match);
    }
  }

  async function handleSendRequest(candidate) {
    if (!user) {
      alert('Please log in to send teammate requests.');
      return;
    }
    if (!activeTeam) {
      alert('Please select or create an active team before inviting candidates.');
      return;
    }

    try {
      await requestsApi.sendRequest({
        teamId: activeTeam.id,
        receiverProfileId: candidate.id,
        requestType: 'team_invite',
        message: `Hi ${candidate.full_name}, we analyzed your skillset and you are an ideal fit for our hackathon project ${activeTeam.name}!`
      });
      alert(`Teammate invitation sent to ${candidate.full_name}!`);
      setSentRequestIds(prev => new Set([...prev, candidate.id]));
    } catch (err) {
      alert(err.message || 'Failed to send request.');
    }
  }

  function handleResetFilters() {
    setSearch('');
    setDepartment('All');
    setYear('All');
    setGender('All');
    setRole('All');
    setSkill('All');
    setExperienceLevel('All');
    setAvailabilityDays('All');
    setMinScore('');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
            Candidate Discovery Portal
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Find Teammates
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTeam
              ? `Ranked dynamically against your active roster: "${activeTeam.name}"`
              : 'Sign in or select a team to enable real-time Team Gap Compatibility scoring'}
          </p>
        </div>

        {activeTeam && (
          <div className="bg-slate-900 border border-indigo-900/60 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Team Context</span>
              <span className="font-bold text-white">{activeTeam.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate by name, bio, skills, or department..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Department */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="AI & DS">AI & DS</option>
              <option value="ECE">ECE</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Roles</option>
              {metadata.roles.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Skill */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Skill
            </label>
            <select
              value={skill}
              onChange={e => setSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Skills</option>
              {metadata.skills.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Experience
            </label>
            <select
              value={experienceLevel}
              onChange={e => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Availability
            </label>
            <select
              value={availabilityDays}
              onChange={e => setAvailabilityDays(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">Any Days</option>
              <option value="Weekends">Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="All Days">All Days</option>
            </select>
          </div>

          {/* Min Compatibility Score */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Min Match Score
            </label>
            <select
              value={minScore}
              onChange={e => setMinScore(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Any Score</option>
              <option value="90">90%+ (Excellent)</option>
              <option value="75">75%+ (Strong)</option>
              <option value="60">60%+ (Potential)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Helper */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Showing <strong className="text-white">{students.length}</strong> matching candidate{students.length === 1 ? '' : 's'}
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Candidates List */}
      {loading ? (
        <LoadingState message="Recalculating compatibility scores..." />
      ) : students.length === 0 ? (
        <EmptyState
          title="No Candidates Found"
          description="No candidates match your current filter criteria. Try broadening your role, skill, or minimum compatibility score parameters."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(cand => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              hasPendingRequest={sentRequestIds.has(cand.id)}
              onSimulate={handleSimulate}
              onWhyMatch={handleWhyMatch}
              onSendRequest={handleSendRequest}
            />
          ))}
        </div>
      )}

      {/* WHAT-IF SIMULATOR MODAL */}
      {simulationData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8">
            <div className="text-right mb-2">
              <button
                onClick={() => setSimulationData(null)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Close Simulator
              </button>
            </div>
            <WhatIfSimulator simulation={simulationData} />
          </div>
        </div>
      )}

      {/* WHY MATCH MODAL */}
      {whyMatchData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full my-8">
            <div className="text-right mb-2">
              <button
                onClick={() => setWhyMatchData(null)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
            <MatchBreakdown match={whyMatchData} />
          </div>
        </div>
      )}
    </div>
  );
}
