import React from 'react';
import { AlertTriangle, ShieldAlert, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export function TeamRiskPanel({ risks = [] }) {
  const riskList = Array.isArray(risks) ? risks : (risks.risks || []);

  const getRiskStyles = (level) => {
    switch (level) {
      case 'HIGH':
        return {
          card: 'bg-rose-950/20 border-rose-800/40',
          badge: 'bg-rose-950 text-rose-300 border-rose-800/80',
          icon: ShieldAlert,
          iconColor: 'text-rose-400'
        };
      case 'MEDIUM':
        return {
          card: 'bg-amber-950/20 border-amber-800/40',
          badge: 'bg-amber-950 text-amber-300 border-amber-800/80',
          icon: AlertTriangle,
          iconColor: 'text-amber-400'
        };
      default:
        return {
          card: 'bg-slate-900 border-slate-800',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: Info,
          iconColor: 'text-slate-400'
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Vulnerability Analysis
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Team Risk Detector
          </h3>
        </div>

        <span className="text-xs font-bold bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full">
          {riskList.length} Risk{riskList.length === 1 ? '' : 's'} Identified
        </span>
      </div>

      {riskList.length === 0 ? (
        <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-slate-800/60">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-200">Zero Critical Team Risks Detected</p>
          <p className="text-xs text-slate-400 mt-1">Your team composition is balanced with solid technical and operational coverage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {riskList.map((risk, idx) => {
            const styles = getRiskStyles(risk.level);
            const Icon = styles.icon;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${styles.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${styles.iconColor}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{risk.title}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded border ${styles.badge}`}>
                          {risk.level}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                        Category: {risk.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {risk.description}
                </p>

                {risk.recommendation && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-xs text-indigo-300">
                    <span className="font-semibold text-indigo-400 shrink-0">Remediation:</span>
                    <span>{risk.recommendation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
