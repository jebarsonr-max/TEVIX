import React from 'react';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export function TeamDNAPanel({ dnaData, teamBalanceScore, explanation }) {
  if (!dnaData) return null;

  const dna = dnaData.dna || dnaData;

  const pillarsList = [
    { key: 'Frontend', color: 'bg-cyan-500', text: 'text-cyan-400' },
    { key: 'Backend', color: 'bg-emerald-500', text: 'text-emerald-400' },
    { key: 'AI/ML', color: 'bg-purple-500', text: 'text-purple-400' },
    { key: 'Database', color: 'bg-amber-500', text: 'text-amber-400' },
    { key: 'UI/UX', color: 'bg-pink-500', text: 'text-pink-400' },
    { key: 'Cloud', color: 'bg-blue-500', text: 'text-blue-400' },
    { key: 'Cybersecurity', color: 'bg-rose-500', text: 'text-rose-400' },
    { key: 'IoT', color: 'bg-orange-500', text: 'text-orange-400' },
    { key: 'Research', color: 'bg-teal-500', text: 'text-teal-400' },
    { key: 'Presentation', color: 'bg-indigo-500', text: 'text-indigo-400' },
    { key: 'Leadership', color: 'bg-violet-500', text: 'text-violet-400' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            Capability Architecture
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Team DNA — 11 Dimension Vector
          </h3>
        </div>

        {teamBalanceScore !== undefined && (
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Overall Balance</span>
              <span className={`text-2xl font-black ${
                teamBalanceScore >= 80 ? 'text-emerald-400' :
                teamBalanceScore >= 65 ? 'text-indigo-400' :
                teamBalanceScore >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {teamBalanceScore}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Natural Language Assessment */}
      {explanation && (
        <div className="bg-slate-950/70 border border-indigo-950/80 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* 11 Horizontal Capability Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
        {pillarsList.map(pillar => {
          const data = dna[pillar.key] || { score: 0, skillsCovered: [], memberContributions: [] };
          const score = data.score || 0;
          const contributors = (data.memberContributions || []).map(m => m.name).join(', ');

          return (
            <div key={pillar.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${pillar.color}`}></span>
                  {pillar.key}
                </span>
                <span className={`font-bold ${score > 0 ? pillar.text : 'text-slate-600'}`}>
                  {score}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/60">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${score > 0 ? pillar.color : 'bg-transparent'}`}
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>

              {/* Contributing context */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 truncate">
                <span>
                  {data.skillsCovered && data.skillsCovered.length > 0
                    ? data.skillsCovered.join(', ')
                    : 'No skills logged'}
                </span>
                {contributors && (
                  <span className="text-slate-400 shrink-0 ml-1">
                    ({contributors})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
