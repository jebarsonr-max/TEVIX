import React from 'react';
import { Activity, Check, AlertTriangle, ArrowUpRight } from 'lucide-react';

export function TeamBalanceCard({ score = 0, strongPillars = [], weakPillars = [], explanation = '' }) {
  const numScore = Math.round(score);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            Team Balance Index
          </div>
          <span className={`text-2xl font-black ${
            numScore >= 80 ? 'text-emerald-400' :
            numScore >= 65 ? 'text-indigo-400' :
            numScore >= 50 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {numScore}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800/80 mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              numScore >= 80 ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' :
              numScore >= 65 ? 'bg-indigo-500' :
              numScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(numScore, 100)}%` }}
          />
        </div>

        {/* Capabilities Checklist */}
        <div className="space-y-1.5 text-xs">
          {strongPillars.slice(0, 3).map((sp, idx) => (
            <div key={idx} className="flex items-center gap-2 text-emerald-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{sp} capability verified</span>
            </div>
          ))}

          {weakPillars.slice(0, 2).map((wp, idx) => (
            <div key={idx} className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{wp} deficient — recruitment needed</span>
            </div>
          ))}
        </div>
      </div>

      {explanation && (
        <p className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 leading-snug">
          {explanation}
        </p>
      )}
    </div>
  );
}
