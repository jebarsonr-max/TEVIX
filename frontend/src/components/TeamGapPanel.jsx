import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Flame, Layers, ShieldAlert, Sparkles, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TeamGapPanel({ gaps, onFindTeammatesClick }) {
  if (!gaps) return null;

  const {
    summary,
    recommendedNextRole,
    recommendedNextSkills = [],
    missingRequiredSkills = [],
    missingRequiredRoles = [],
    generalSkillGaps = [],
    missingCapabilities = [],
    skillRedundancies = [],
    roleRedundancies = []
  } = gaps;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-indigo-950/40 to-slate-900 p-5 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5" />
              PRIMARY NOVEL FEATURE: TEAM GAP INTELLIGENCE
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Composition Gap Analysis
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Recommended Next Role Action Box */}
          <div className="bg-slate-950/80 border border-indigo-500/40 rounded-xl p-4 shrink-0 shadow-lg text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Recommended Next Role
            </span>
            <div className="text-base font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>{recommendedNextRole}</span>
            </div>
            {onFindTeammatesClick ? (
              <button
                onClick={onFindTeammatesClick}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Find Candidates <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to={`/students?role=${encodeURIComponent(recommendedNextRole)}`}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Find Candidates <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. MISSING TECHNICAL SKILLS */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Missing Technical Skills</span>
          </div>

          <div className="space-y-2">
            {missingRequiredSkills.length > 0 ? (
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Required by Team</span>
                <div className="flex flex-wrap gap-1.5">
                  {missingRequiredSkills.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60 font-medium">
                      ❌ {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {generalSkillGaps.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Foundational Gaps</span>
                <div className="space-y-1">
                  {generalSkillGaps.map((gap, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missingRequiredSkills.length === 0 && generalSkillGaps.length === 0 && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All foundational skills covered!
              </p>
            )}
          </div>
        </div>

        {/* 2. MISSING PROJECT CAPABILITIES */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <span>Missing Project Capabilities</span>
          </div>

          <div className="space-y-2.5">
            {missingCapabilities.length > 0 ? (
              missingCapabilities.slice(0, 3).map((cap, idx) => (
                <div key={idx} className="text-xs space-y-0.5 border-l-2 border-amber-500/60 pl-2">
                  <span className="font-semibold text-slate-200 block">{cap.title}</span>
                  <p className="text-[11px] text-slate-400 leading-tight">{cap.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full project capability stack in place.
              </p>
            )}
          </div>
        </div>

        {/* 3. REDUNDANCIES & PRIORITY RECOMMENDATIONS */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Priority Target Skills</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">
              Prioritize in Next Recruitment
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recommendedNextSkills.map((sk, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-medium">
                  +{sk}
                </span>
              ))}
            </div>
          </div>

          {skillRedundancies.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Detected Redundancies
              </span>
              <div className="text-xs text-slate-400 space-y-0.5">
                {skillRedundancies.slice(0, 2).map((r, idx) => (
                  <div key={idx}>
                    ⚠️ <span className="text-slate-300 font-medium">{r.skill}</span> shared by {r.count} members
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
