import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Bell, Lock, Shield, CheckCircle2 } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
          Preferences
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure notification alerts and team discovery privacy settings
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            Notification Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Email Alerts for Teammate Invitations</span>
                <span className="text-slate-400">Receive an email when team leaders invite you to their roster</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">High Complementarity Candidate Alerts</span>
                <span className="text-slate-400">Alert your team when a new candidate with 90%+ match registers</span>
              </div>
              <input
                type="checkbox"
                checked={matchNotifications}
                onChange={e => setMatchNotifications(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Account Security
          </h3>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Authenticated Session</span>
              <span className="text-slate-400">Signed in as {user?.email || 'Student User'}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
              Protected JWT
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-indigo-600/30"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
