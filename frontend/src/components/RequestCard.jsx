import React, { useState } from 'react';
import { Check, X, Ban, Clock, Send, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RequestCard({ request, isIncoming, onStatusUpdate }) {
  const [loading, setLoading] = useState(false);

  const isPending = request.status === 'pending';

  async function handleAction(status) {
    setLoading(true);
    try {
      await onStatusUpdate(request.id, status);
    } catch (err) {
      alert('Error updating request: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const statusBadge = (st) => {
    switch (st) {
      case 'accepted':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Accepted</span>;
      case 'rejected':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">Rejected</span>;
      case 'cancelled':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Cancelled</span>;
      default:
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center font-bold text-indigo-300">
            {isIncoming ? (request.sender_name?.charAt(0) || 'U') : (request.receiver_name?.charAt(0) || 'U')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {isIncoming ? request.sender_name : request.receiver_name}
              </span>
              <span className="text-xs text-slate-400">
                ({isIncoming ? request.sender_dept : request.receiver_dept})
              </span>
            </div>
            <p className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3" /> Team: {request.team_name}
            </p>
          </div>
        </div>

        <div>
          {statusBadge(request.status)}
        </div>
      </div>

      {request.message && (
        <p className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/60 italic">
          "{request.message}"
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
        <span>
          Type: {request.request_type === 'team_invite' ? 'Team Invitation' : 'Join Request'}
        </span>

        {isPending && (
          <div className="flex items-center gap-2">
            {isIncoming ? (
              <>
                <button
                  disabled={loading}
                  onClick={() => handleAction('rejected')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-semibold transition-colors flex items-center gap-1 text-xs"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleAction('accepted')}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1 text-xs shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Accept
                </button>
              </>
            ) : (
              <button
                disabled={loading}
                onClick={() => handleAction('cancelled')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 font-semibold transition-colors flex items-center gap-1 text-xs"
              >
                <Ban className="w-3 h-3" /> Cancel Request
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
