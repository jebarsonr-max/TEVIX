import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, CheckCircle2, ChevronRight, HelpCircle, Send, Sparkles, TrendingUp, User } from 'lucide-react';
import { SkillBadge, RoleBadge } from './SkillBadge';
import { CompatibilityScore } from './CompatibilityScore';

export function CandidateCard({
  candidate,
  onSimulate,
  onWhyMatch,
  onSendRequest,
  hasPendingRequest = false
}) {
  const match = candidate.match;
  const skills = candidate.skills || [];
  const roles = candidate.roles || [];
  const primaryRole = roles[0]?.name || 'Student Developer';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Avatar, Name, Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {candidate.avatar_url ? (
                <img
                  src={candidate.avatar_url}
                  alt={candidate.full_name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  {candidate.full_name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Available"></span>
            </div>

            <div>
              <Link
                to={`/students/${candidate.id}`}
                className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5"
              >
                <span>{candidate.full_name}</span>
              </Link>
              <div className="text-xs text-slate-400 font-medium">
                {candidate.department} • Year {candidate.year} • {candidate.gender}
              </div>
            </div>
          </div>

          {match && (
            <CompatibilityScore
              score={match.totalScore}
              category={match.matchCategory}
              impactDelta={match.teamImpactDelta}
            />
          )}
        </div>

        {/* Roles */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {roles.map((r, idx) => (
            <RoleBadge key={idx} role={r} isPrimary={idx === 0} />
          ))}
        </div>

        {/* Bio */}
        {candidate.bio && (
          <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {candidate.bio}
          </p>
        )}

        {/* Skills */}
        <div className="mt-3.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
            Technical Competencies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 5).map((s, idx) => (
              <SkillBadge key={idx} skill={s} />
            ))}
            {skills.length > 5 && (
              <span className="text-xs text-slate-400 font-medium self-center px-1">
                +{skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Key Reason Highlight */}
        {match && match.whyPoints && match.whyPoints.length > 0 && (
          <div className="mt-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Key Team Value
            </span>
            <p className="truncate text-slate-200">{match.whyPoints[0].replace(/^[✓•\s]+/, '')}</p>
          </div>
        )}

        {/* Experience & Availability Pill */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2.5">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            {candidate.hackathons_count || 0} Hackathons • {candidate.experience_level}
          </span>
          <span>
            {candidate.availability?.days || 'Weekends'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Link
          to={`/students/${candidate.id}`}
          className="text-xs font-semibold py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-center transition-colors flex items-center justify-center gap-1"
        >
          <User className="w-3 h-3" /> Profile
        </Link>

        {match && (
          <button
            onClick={() => onWhyMatch && onWhyMatch(candidate)}
            className="text-xs font-semibold py-1.5 px-2 rounded-lg bg-indigo-950 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/50 text-center transition-colors flex items-center justify-center gap-1"
          >
            <HelpCircle className="w-3 h-3" /> Why Match?
          </button>
        )}

        {match && (
          <button
            onClick={() => onSimulate && onSimulate(candidate)}
            className="text-xs font-semibold py-1.5 px-2 rounded-lg bg-emerald-950 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 text-center transition-colors flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Simulate
          </button>
        )}

        <button
          onClick={() => onSendRequest && onSendRequest(candidate)}
          disabled={hasPendingRequest}
          className={`text-xs font-semibold py-1.5 px-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
            hasPendingRequest
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
          }`}
        >
          <Send className="w-3 h-3" /> {hasPendingRequest ? 'Sent' : 'Request'}
        </button>
      </div>
    </div>
  );
}
