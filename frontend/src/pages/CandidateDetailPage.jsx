import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentsApi, requestsApi } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { SkillBadge, RoleBadge } from '../components/SkillBadge';
import { CompatibilityScore } from '../components/CompatibilityScore';
import { MatchBreakdown } from '../components/MatchBreakdown';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import {
  Award,
  Calendar,
  Clock,
  Globe,
  ExternalLink,
  Mail,
  Send,
  Sparkles,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react';

export function CandidateDetailPage() {
  const { id } = useParams();
  const { user, activeTeam } = useAuth();

  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    async function loadCandidate() {
      setLoading(true);
      try {
        const res = await studentsApi.getStudentById(id, activeTeam?.id);
        setCandidateData(res);
      } catch (err) {
        setError(err.message || 'Failed to load candidate profile.');
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [id, activeTeam]);

  async function handleSendInvite(e) {
    e.preventDefault();
    if (!activeTeam) {
      alert('Please select or create an active team before inviting candidates.');
      return;
    }
    setSendingRequest(true);
    try {
      await requestsApi.sendRequest({
        teamId: activeTeam.id,
        receiverProfileId: parseInt(id, 10),
        requestType: 'team_invite',
        message: requestMessage.trim() || `Hi ${candidateData.student.full_name}, we'd love for you to join ${activeTeam.name}!`
      });
      setRequestSent(true);
      alert('Invitation sent successfully!');
    } catch (err) {
      alert(err.message || 'Failed to send invite.');
    } finally {
      setSendingRequest(false);
    }
  }

  if (loading) return <LoadingState message="Fetching candidate profile and simulating team impact..." />;
  if (error || !candidateData) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Candidate Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'This student profile does not exist.'}</p>
        <Link to="/students" className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm">
          Return to Candidates
        </Link>
      </div>
    );
  }

  const { student, match, simulation } = candidateData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Discovery
        </Link>
      </div>

      {/* TOP PROFILE HERO CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              {student.avatar_url ? (
                <img
                  src={student.avatar_url}
                  alt={student.full_name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-950 text-indigo-300 font-black text-2xl flex items-center justify-center border-2 border-indigo-700/50 shadow-xl">
                  {student.full_name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Active student"></span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {student.full_name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  {student.department} • Year {student.year}
                </span>
              </div>

              {/* Roles */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {student.roles?.map((r, idx) => (
                  <RoleBadge key={idx} role={r} isPrimary={idx === 0} size="md" />
                ))}
              </div>

              {student.bio && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl pt-2 leading-relaxed">
                  {student.bio}
                </p>
              )}
            </div>
          </div>

          {/* Compatibility Score Widget */}
          {match && (
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shrink-0 text-center sm:text-right shadow-inner">
              <CompatibilityScore
                score={match.totalScore}
                category={match.matchCategory}
                impactDelta={match.teamImpactDelta}
                size="lg"
              />
            </div>
          )}
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Experience Level</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" /> {student.experience_level}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Past Hackathons</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {student.hackathons_count || 0} Participated
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Availability Schedule</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> {student.availability?.days} ({student.availability?.hoursPerWeek} hrs/wk)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Social Verification</span>
            <div className="flex items-center gap-2 mt-1">
              {student.github_url && (
                <a href={student.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="GitHub">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {student.linkedin_url && (
                <a href={student.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="LinkedIn">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <span className="text-[11px] text-slate-400">{student.contact_preference} preferred</span>
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS BREAKDOWN */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Verified Skill Vector
        </h3>
        <div className="flex flex-wrap gap-2">
          {student.skills?.map((s, idx) => (
            <SkillBadge key={idx} skill={s} size="md" />
          ))}
        </div>
      </div>

      {/* WHAT-IF SIMULATOR SECTION */}
      {simulation && (
        <section className="space-y-3">
          <WhatIfSimulator simulation={simulation} />
        </section>
      )}

      {/* 2-COLUMN GRID: MATCH BREAKDOWN & SEND REQUEST ACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Explainable Match Breakdown */}
        {match ? (
          <MatchBreakdown match={match} />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">No Active Team Selected</h4>
            <p className="text-xs text-slate-400 mb-4">
              Select or create a team to see explainable compatibility scoring for this candidate.
            </p>
            <Link to="/teams/create" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs">
              Create a Team
            </Link>
          </div>
        )}

        {/* Right: Send Request Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Send className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Send Teammate Request
            </h3>
          </div>

          {activeTeam ? (
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-white block">Inviting to Team:</span>
                <span className="text-indigo-400 font-bold">{activeTeam.name}</span>
                <span className="text-slate-500 block">Current roster: {activeTeam.currentMemberCount || (activeTeam.members?.length)}/{activeTeam.max_size} members</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Custom Pitch Message
                </label>
                <textarea
                  rows={4}
                  value={requestMessage}
                  onChange={e => setRequestMessage(e.target.value)}
                  placeholder={`Hi ${student.full_name}, we are looking for someone with your capabilities to help us build our hackathon project...`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={sendingRequest || requestSent}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  requestSent
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {sendingRequest ? (
                  <span>Sending Invitation...</span>
                ) : requestSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Request Sent Successfully</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Teammate Invitation</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-400">
                You must have an active team to invite candidates.
              </p>
              <Link
                to="/teams/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
              >
                Create a Team First
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
