import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamsApi } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { Users, PlusCircle, ArrowRight, ShieldCheck, Award, Activity, Crown } from 'lucide-react';

export function TeamsPage() {
  const { user, profile, activeTeam, updateActiveTeam } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      setLoading(true);
      try {
        const res = await teamsApi.getTeams(false);
        setTeams(res.teams || []);
      } catch (err) {
        console.error('Failed to load teams:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  if (loading) return <LoadingState message="Loading hackathon teams..." />;

  const myTeams = teams.filter(t => t.members?.some(m => m.id === profile?.id));
  const otherTeams = teams.filter(t => !t.members?.some(m => m.id === profile?.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
            Roster Management
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Hackathon Teams
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your rosters and explore competing hackathon teams
          </p>
        </div>

        <Link
          to="/teams/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-indigo-600/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Team</span>
        </Link>
      </div>

      {/* MY TEAMS SECTION */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>My Teams ({myTeams.length})</span>
        </h2>

        {myTeams.length === 0 ? (
          <EmptyState
            title="You Haven't Created or Joined a Team Yet"
            description="Form your team to run Team Gap Intelligence, simulate additions, and track Hackathon Readiness."
            actionText="Create Team"
            actionLink="/teams/create"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTeams.map(t => {
              const isLeader = t.leader_id === profile?.id;
              const isActive = activeTeam?.id === t.id;

              return (
                <div
                  key={t.id}
                  className={`bg-slate-900 border rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all ${
                    isActive ? 'border-indigo-500/80 ring-1 ring-indigo-500/50' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{t.name}</h3>
                          {isLeader && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" /> Leader
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-indigo-400 font-semibold block mt-0.5">
                          {t.hackathon?.name || 'Open Hackathon'}
                        </span>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          Active
                        </span>
                      )}
                    </div>

                    {t.description && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    )}

                    {/* Member chips */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                        Roster ({t.members?.length || 0} / {t.max_size})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.members?.map(m => (
                          <span
                            key={m.id}
                            className="text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                          >
                            {m.full_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    {!isActive && (
                      <button
                        onClick={() => updateActiveTeam(t)}
                        className="text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Set as Active
                      </button>
                    )}

                    <Link
                      to={`/teams/${t.id}`}
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-800/60 transition-colors"
                    >
                      <span>Team Cockpit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ALL COMPETING TEAMS SECTION */}
      {otherTeams.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <span>Other Teams in Ecosystem ({otherTeams.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTeams.map(t => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{t.name}</h3>
                  <span className="text-xs text-slate-400 block mt-0.5">{t.hackathon?.name}</span>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">{t.description}</p>
                  <span className="text-[11px] text-slate-500 block mt-2">
                    Capacity: {t.members?.length || 0} / {t.max_size} members
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <Link
                    to={`/teams/${t.id}`}
                    className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    View Roster & Analytics <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
