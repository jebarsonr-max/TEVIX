import React from 'react';
import { SearchX, Users, Inbox, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({
  icon: Icon = SearchX,
  title = 'No Results Found',
  description = 'No items match your criteria.',
  actionText,
  actionLink,
  onAction
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 text-center max-w-xl mx-auto shadow-lg my-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mx-auto mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/30"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/30"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )
      )}
    </div>
  );
}
