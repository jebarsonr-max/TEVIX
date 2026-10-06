import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export function CompatibilityScore({ score, category, impactDelta, size = 'md' }) {
  const numScore = Math.round(score || 0);

  // Color schemes based on score tier
  let colorTheme = {
    ring: 'border-emerald-500/60 bg-emerald-950/20 text-emerald-400',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    bar: 'bg-emerald-500'
  };

  if (numScore < 60) {
    colorTheme = {
      ring: 'border-rose-500/60 bg-rose-950/20 text-rose-400',
      badge: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
      bar: 'bg-rose-500'
    };
  } else if (numScore < 75) {
    colorTheme = {
      ring: 'border-amber-500/60 bg-amber-950/20 text-amber-400',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
      bar: 'bg-amber-500'
    };
  } else if (numScore < 90) {
    colorTheme = {
      ring: 'border-indigo-500/60 bg-indigo-950/20 text-indigo-400',
      badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
      bar: 'bg-indigo-500'
    };
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-xs border ${colorTheme.badge}`}>
          {numScore}% Match
        </span>
        {impactDelta > 0 && (
          <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +{impactDelta}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end text-right">
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-black tracking-tight ${colorTheme.ring.split(' ')[2]}`}>
          {numScore}%
        </span>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Team Match</span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colorTheme.badge}`}>
          {category || (numScore >= 90 ? 'Excellent Match' : numScore >= 75 ? 'Strong Match' : numScore >= 60 ? 'Potential Match' : 'Low Match')}
        </span>

        {impactDelta > 0 && (
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 shadow-sm">
            <TrendingUp className="w-3 h-3" />
            Impact: +{impactDelta}%
          </span>
        )}
      </div>
    </div>
  );
}
