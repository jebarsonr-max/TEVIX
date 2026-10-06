import React from 'react';

export function SkillBadge({ skill, proficiency, showProficiency = true, size = 'sm' }) {
  const name = typeof skill === 'string' ? skill : skill.name;
  const prof = proficiency || (typeof skill === 'object' ? skill.proficiency : null);

  const sizeClasses = size === 'xs' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'md' 
    ? 'text-sm px-3 py-1' 
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium border bg-slate-800/80 border-slate-700 text-slate-200 ${sizeClasses}`}>
      <span>{name}</span>
      {showProficiency && prof && (
        <span className={`text-[10px] uppercase tracking-wider px-1 py-0.2 rounded font-semibold ${
          prof === 'Expert' ? 'bg-purple-950 text-purple-300 border border-purple-800/50' :
          prof === 'Advanced' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/50' :
          prof === 'Intermediate' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' :
          'bg-slate-800 text-slate-400'
        }`}>
          {prof}
        </span>
      )}
    </span>
  );
}

export function RoleBadge({ role, isPrimary = false, size = 'sm' }) {
  const name = typeof role === 'string' ? role : role.name;
  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md font-medium border ${
      isPrimary 
        ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200' 
        : 'bg-slate-900 border-slate-700/80 text-slate-300'
    } ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
      <span>{name}</span>
    </span>
  );
}
