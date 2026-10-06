import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Sparkles, Layers, Zap } from 'lucide-react';

export function WhatIfSimulator({ simulation }) {
  if (!simulation) return null;

  const { before, after, improvement, pillarShifts, explanation, candidateName } = simulation;

  // Selected key pillars for quick visual comparison
  const pillarsToCompare = ['Backend', 'AI/ML', 'Database', 'Frontend', 'Cloud'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              NOVEL FEATURE: WHAT-IF TEAM SIMULATOR
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              What If {candidateName} Joins?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulating full team vector transformation and capability uplift.
            </p>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl px-4 py-2 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">Projected Lift</span>
            <span className="text-2xl font-black text-emerald-300 flex items-center justify-center gap-1">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              {improvement?.balanceDelta || '+0%'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Core Metric Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TEAM BALANCE SCORE COMPARISON */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Team Balance Score
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">CURRENT</span>
                <span className="text-2xl font-extrabold text-slate-300">{before?.teamBalanceScore}%</span>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-400 shrink-0 mx-2" />
              <div>
                <span className="text-xs text-indigo-400 font-semibold block">AFTER ADDING</span>
                <span className="text-3xl font-black text-emerald-400">{after?.teamBalanceScore}%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold block">IMPROVEMENT</span>
                <span className="text-sm font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {improvement?.balanceDelta}
                </span>
              </div>
            </div>
          </div>

          {/* HACKATHON READINESS COMPARISON */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Hackathon Readiness
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">CURRENT</span>
                <span className="text-2xl font-extrabold text-slate-300">{before?.readinessScore}%</span>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-400 shrink-0 mx-2" />
              <div>
                <span className="text-xs text-indigo-400 font-semibold block">AFTER ADDING</span>
                <span className="text-3xl font-black text-indigo-400">{after?.readinessScore}%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-indigo-400 font-bold block">IMPROVEMENT</span>
                <span className="text-sm font-black text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {improvement?.readinessDelta}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NATURAL LANGUAGE EXPLANATION */}
        {explanation && (
          <div className="bg-indigo-950/30 border border-indigo-900/60 rounded-xl p-4 text-sm text-indigo-200 flex items-start gap-3">
            <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{explanation}</p>
          </div>
        )}

        {/* PILLAR-BY-PILLAR SHIFT ANALYSIS */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Pillar Capability Shift (Before vs After)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pillarsToCompare.map(pKey => {
              const shift = pillarShifts?.[pKey] || { before: 0, after: 0, delta: 0 };
              const isImproved = shift.delta > 0;

              return (
                <div
                  key={pKey}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    isImproved
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : 'bg-slate-950/40 border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{pKey} Coverage</span>
                    {isImproved ? (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                        +{shift.delta}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Unchanged</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-400 pt-1">
                    <span>Before: <strong className="text-slate-200">{shift.before}%</strong></span>
                    <span>→</span>
                    <span>After: <strong className={isImproved ? 'text-emerald-300' : 'text-slate-200'}>{shift.after}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
