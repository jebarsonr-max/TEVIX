import React from 'react';
import { Award, CheckCircle2, ChevronRight, Lightbulb, ShieldAlert, TrendingUp } from 'lucide-react';

export function ReadinessScore({ readiness }) {
  if (!readiness) return null;

  const { readinessScore = 0, status = '', breakdown = {}, recommendations = [] } = readiness;

  const items = [
    { label: 'Technical Coverage', val: breakdown.technicalCoverage?.score || 0, max: 30, color: 'bg-indigo-500' },
    { label: 'Role Coverage', val: breakdown.roleCoverage?.score || 0, max: 20, color: 'bg-cyan-500' },
    { label: 'Skill Complementarity', val: breakdown.skillComplementarity?.score || 0, max: 20, color: 'bg-emerald-500' },
    { label: 'Experience Level', val: breakdown.experience?.score || 0, max: 10, color: 'bg-purple-500' },
    { label: 'Availability Overlap', val: breakdown.availability?.score || 0, max: 10, color: 'bg-amber-500' },
    { label: 'Team Balance Weight', val: breakdown.teamBalance?.score || 0, max: 10, color: 'bg-pink-500' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            Competition Readiness Index
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Hackathon Readiness Score
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Multi-factor readiness model tailored for hackathon evaluation criteria.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Status Index</span>
            <span className="text-2xl font-black text-white">{readinessScore}</span>
            <span className="text-slate-400 text-xs font-bold"> / 100</span>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
        readinessScore >= 85
          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
          : readinessScore >= 70
          ? 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200'
          : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
      }`}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <div>
          <span className="font-bold">Assessment Status: </span>
          <span>{status}</span>
        </div>
      </div>

      {/* Dimension Bars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Factor Weights Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {items.map((item, idx) => {
            const pct = Math.round((item.val / item.max) * 100);
            return (
              <div key={idx} className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-bold text-white">{item.val} <span className="text-slate-500 font-normal">/ {item.max}</span></span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" /> Actionable Recommendations
          </h4>
          <div className="space-y-1.5">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2 rounded border border-slate-800/60">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
