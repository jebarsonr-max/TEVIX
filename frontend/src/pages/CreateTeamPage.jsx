import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamsApi, metadataApi } from '../services/api';
import { PlusCircle, ArrowRight, Sparkles, AlertCircle, Users, Check } from 'lucide-react';

export function CreateTeamPage() {
  const { user, profile, refreshTeams, updateActiveTeam } = useAuth();
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState({ skills: [], roles: [], hackathons: [] });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hackathonId: '',
    maxSize: 4,
    departmentPreference: 'Any',
    genderRequirement: 'Any',
    experienceRequirement: 'Any',
    preferredAvailability: 'Weekends & Evenings',
    notes: ''
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    metadataApi.getMetadata().then(data => {
      setMetadata(data);
      if (data.hackathons?.length > 0) {
        setFormData(prev => ({ ...prev, hackathonId: data.hackathons[0].id }));
      }
    }).catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a team name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await teamsApi.createTeam({
        ...formData,
        requiredSkills: selectedSkills,
        requiredRoles: selectedRoles
      });

      await refreshTeams(profile.id);
      updateActiveTeam(res.team);
      navigate(`/teams/${res.team.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
          Team Builder
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Create Hackathon Team
        </h1>
        <p className="text-xs text-slate-400">
          Configure your team parameters. TEVIX will instantly analyze gaps and recommend optimal teammates.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hackathon Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Select Target Hackathon *
            </label>
            <select
              required
              value={formData.hackathonId}
              onChange={e => setFormData({ ...formData, hackathonId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {metadata.hackathons.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.category} (Team size: {h.team_size_min}-{h.team_size_max})
                </option>
              ))}
            </select>
          </div>

          {/* Team Name & Max Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Team Quantum Leap"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Max Team Size
              </label>
              <select
                value={formData.maxSize}
                onChange={e => setFormData({ ...formData, maxSize: parseInt(e.target.value, 10) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={3}>3 Members</option>
                <option value={4}>4 Members</option>
                <option value={5}>5 Members</option>
                <option value={6}>6 Members</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Project Description / Problem Statement
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="What problem is your team building a solution for? Mention domain and architecture ideas..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Required Roles to Recruit */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Required Roles to Recruit ({selectedRoles.length} selected)
            </label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
              {metadata.roles.map(r => {
                const isSelected = selectedRoles.includes(r.id);
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => {
                      if (isSelected) setSelectedRoles(selectedRoles.filter(id => id !== r.id));
                      else setSelectedRoles([...selectedRoles, r.id]);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Required Skills to Recruit ({selectedSkills.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
              {metadata.skills.map(s => {
                const isSelected = selectedSkills.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => {
                      if (isSelected) setSelectedSkills(selectedSkills.filter(id => id !== s.id));
                      else setSelectedSkills([...selectedSkills, s.id]);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diversity and Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Department Preference
              </label>
              <select
                value={formData.departmentPreference}
                onChange={e => setFormData({ ...formData, departmentPreference: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Any">Any (Interdisciplinary)</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AI & DS">AI & DS</option>
                <option value="ECE">ECE</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Gender Requirement
              </label>
              <select
                value={formData.genderRequirement}
                onChange={e => setFormData({ ...formData, genderRequirement: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Any">Any (No Requirement)</option>
                <option value="Female Representation Required">Female Representation Required</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Preferred Availability
              </label>
              <select
                value={formData.preferredAvailability}
                onChange={e => setFormData({ ...formData, preferredAvailability: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Weekends & Evenings">Weekends & Evenings</option>
                <option value="Full Time / Intensive">Full Time / Intensive</option>
                <option value="Flexible Schedule">Flexible Schedule</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <span>{loading ? 'Assembling Team...' : 'Create Team & Launch Intelligence'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
