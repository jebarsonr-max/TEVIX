import React from 'react';
import { Crown, Trash2, Award, Clock } from 'lucide-react';
import { SkillBadge } from './SkillBadge';

export function TeamMemberCard({ member, isLeader, canRemove, onRemove }) {
  const skills = member.skills || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.full_name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-indigo-950 text-indigo-300 flex items-center justify-center font-bold text-base border border-indigo-800/60">
                  {member.full_name?.charAt(0) || 'U'}
                </div>
              )}
              {isLeader && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow" title="Team Leader">
                  <Crown className="w-3 h-3" />
                </span>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{member.full_name}</span>
              </h4>
              <p className="text-xs text-indigo-300 font-medium">
                {member.roleInTeam || (member.roles?.[0]?.name) || 'Member'}
              </p>
              <p className="text-[11px] text-slate-400">
                {member.department} • Year {member.year}
              </p>
            </div>
          </div>

          {canRemove && !isLeader && (
            <button
              onClick={() => onRemove && onRemove(member.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Remove member"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Skills */}
        <div className="mt-3">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
            Contributed Skills
          </span>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((s, idx) => (
              <SkillBadge key={idx} skill={s} size="xs" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Award className="w-3 h-3 text-indigo-400" />
          {member.hackathons_count || 0} Hackathons
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          {member.availability?.days || 'Weekends'}
        </span>
      </div>
    </div>
  );
}
