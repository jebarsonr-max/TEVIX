import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamsApi } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { TeamMemberCard } from '../components/TeamMemberCard';
import { TeamGapPanel } from '../components/TeamGapPanel';
import { TeamDNAPanel } from '../components/TeamDNAPanel';
import { ReadinessScore } from '../components/ReadinessScore';
import { TeamRiskPanel } from '../components/TeamRiskPanel';
import { TeamBalanceCard } from '../components/TeamBalanceCard';
import {
  Users,
  Award,
  Crown,
  Compass,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export function TeamDetailPage() {
  const { id } = useParams();
  const { user, profile, updateActiveTeam, refreshTeams } = useAuth();
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTeam() {
    setLoading(true);
    try {
      const res = await teamsApi.getTeamById(id);
      setTeamData(res);
      updateActiveTeam(res.team);
    } catch (err) {
      setError(err.message || 'Failed to load team.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, [id]);

  async function handleRemoveMember(memberProfileId) {
    if (!window.confirm('Are you sure you want to remove this member from the team? Analytics will recalculate immediately.')) {
      return;
    }
    try {
      await teamsApi.removeMember(id, memberProfileId);
      await loadTeam();
      if (profile) await refreshTeams(profile.id);
    } catch (err) {
      alert(err.message || 'Failed to remove member.');
    }
  }

  if (loading) return <LoadingState message="Recalculating team DNA vectors and risks..." />;
  if (error || !teamData) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Team Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'This team does not exist.'}</p>
        <Link to="/teams" className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm">
          Return to Teams
        </Link>
      </div>
    );
  }

  const { team, analytics } = teamData;
  const isLeader = team.leader_id === profile?.id;
  const isFull = team.members.length >= team.max_size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                {team.hackathon?.name || 'Hackathon Roster'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {team.status === 'forming' ? 'Forming Stage' : 'Roster Locked'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{team.name}</span>
            </h1>

            {team.description && (
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {team.description}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!isFull && (
              <Link
                to={`/students?role=${encodeURIComponent(analytics.biggestGap || '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-indigo-600/30"
              >
                <Compass className="w-4 h-4" />
                <span>Find Teammates For Gaps</span>
              </Link>
            )}

            <Link
              to="/requests"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Team Requests</span>
            </Link>
          </div>
        </div>

        {/* Requirements Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Roster Capacity</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              {team.members.length} / {team.max_size} Members {isFull && '(Full)'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Dept Preference</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              {team.requirements?.departmentPreference || 'Any'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Availability Plan</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              {team.requirements?.preferredAvailability || 'Flexible'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Required Roles</span>
            <span className="font-semibold text-slate-200 mt-0.5 block truncate">
              {team.requirements?.requiredRoles?.map(r => r.name).join(', ') || 'None specified'}
            </span>
          </div>
        </div>
      </div>

      {/* ROSTER CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Active Team Members ({team.members.length})</span>
          </h2>

          <span className="text-xs text-slate-400">
            {team.max_size - team.members.length} slot{team.max_size - team.members.length === 1 ? '' : 's'} available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.members.map(member => (
            <TeamMemberCard
              key={member.id}
              member={member}
              isLeader={member.id === team.leader_id}
              canRemove={isLeader && member.id !== team.leader_id}
              onRemove={handleRemoveMember}
            />
          ))}
        </div>
      </div>

      {/* TEAM GAP INTELLIGENCE NOVEL FEATURE */}
      <TeamGapPanel
        gaps={analytics.gaps}
        onFindTeammatesClick={() => navigate(`/students?role=${encodeURIComponent(analytics.biggestGap || '')}`)}
      />

      {/* TEAM DNA & HACKATHON READINESS */}
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

      {/* TEAM RISKS DETECTOR */}
      <div className="space-y-4">
        <TeamRiskPanel risks={analytics.risks} />
      </div>
    </div>
  );
}
