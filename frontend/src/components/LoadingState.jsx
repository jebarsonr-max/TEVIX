import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading intelligence metrics...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-sm opacity-20 -z-10 animate-pulse"></div>
      </div>
      <p className="text-sm font-medium text-slate-300 tracking-wide">{message}</p>
      <span className="text-xs text-slate-500 mt-1">Evaluating team composition vectors</span>
    </div>
  );
}
