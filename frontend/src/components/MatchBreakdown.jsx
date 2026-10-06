import React from 'react';
import { CheckCircle2, ShieldCheck, Target, Zap, Clock, Building, Compass } from 'lucide-react';

export function MatchBreakdown({ match }) {
  if (!match) return null;

  const { breakdown, whyPoints, totalScore, matchCategory, teamImpactDelta } = match;

  const breakdownItems = [
    { label: 'Skill Match & Complementarity', key: 'skillMatch', icon: Zap, color: 'bg-indigo-500' },
    { label: 'Role Alignment', key: 'roleMatch', icon: Target, color: 'bg-cyan-500' },
    { label: 'Experience Level', key: 'experience', icon: ShieldCheck, color: 'bg-emerald-500' },
    { label: 'Availability Compatibility', key: 'availability', icon: Clock, color: 'bg-amber-500' },
    { label: 'Department Diversity', key: 'department', icon: Building, color: 'bg-purple-500' },
    { label: 'Hackathon Interest', key: 'interest', icon: Compass, color: 'bg-pink-500' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Explainable Intelligence</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Match Compatibility Architecture
          </h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{totalScore}%</span>
          <span className="text-xs block text-emerald-400 font-semibold">{matchCategory}</span>
        </div>
      </div>

      {/* WHY THIS CANDIDATE? */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Why Recommended for Your Team?
        </h4>
        <div className="space-y-2 bg-slate-950/60 rounded-lg p-3.5 border border-slate-800/60">
          {whyPoints && whyPoints.length > 0 ? (
            whyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-snug">{point.replace(/^[✓•\s]+/, '')}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No specific complementary highlights calculated.</p>
          )}
        </div>
      </div>

      {/* DETAILED SCORE BREAKDOWN */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Score Breakdown by Dimension
        </h4>
        <div className="space-y-3">
          {breakdownItems.map(item => {
            const data = breakdown?.[item.key] || { score: 0, max: 10 };
            const pct = Math.round((data.score / data.max) * 100);
            const Icon = item.icon;

            return (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-200">
                    <span className="text-white">{data.score}</span>
                    <span className="text-slate-500"> / {data.max}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUMMARY FOOTER */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        <span className="text-slate-400">Total Calculated Compatibility</span>
        <span className="text-sm font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md">
          {totalScore} / 100
        </span>
      </div>
    </div>
  );
}
