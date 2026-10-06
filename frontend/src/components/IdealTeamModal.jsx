import React, { useState, useEffect } from 'react';
import { X, Sparkles, Users, Award, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { metadataApi } from '../services/api';
import { SkillBadge, RoleBadge } from './SkillBadge';

export function IdealTeamModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({ skills: [], roles: [], hackathons: [] });
  const [teamSize, setTeamSize] = useState(4);
  const [selectedRoles, setSelectedRoles] = useState(['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer']);
  const [selectedSkills, setSelectedSkills] = useState(['React', 'Python', 'Machine Learning', 'SQL']);
  const [departmentPref, setDepartmentPref] = useState('Any');
  const [availabilityPref, setAvailabilityPref] = useState('Weekends');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      metadataApi.getMetadata().then(data => setMetadata(data)).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await metadataApi.buildIdealTeam({
        teamSize,
        requiredRoles: selectedRoles,
        requiredSkills: selectedSkills,
        departmentPreference: departmentPref,
        preferredAvailability: availabilityPref
      });
      setResult(res);
    } catch (err) {
      console.error('Ideal team generation failed:', err);
      alert('Failed to generate ideal team: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Build My Ideal Team</h3>
              <p className="text-xs text-slate-400">Algorithmic synthesizer for complementary hackathon rosters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!result ? (
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Target Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={e => setTeamSize(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={3}>3 Members (Core Lean)</option>
                    <option value={4}>4 Members (Standard Hackathon)</option>
                    <option value={5}>5 Members (Extended Squad)</option>
                    <option value={6}>6 Members (SIH Maximum)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Department Preference
                  </label>
                  <select
                    value={departmentPref}
                    onChange={e => setDepartmentPref(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Any">Any Department (Interdisciplinary)</option>
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="AI & DS">Artificial Intelligence & Data Science</option>
                    <option value="ECE">Electronics & Communication (ECE)</option>
                  </select>
                </div>
              </div>

              {/* Roles Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Required Roles ({selectedRoles.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer', 'Mobile Developer', 'Cloud/DevOps Engineer', 'Cybersecurity Engineer', 'IoT Developer', 'Presenter'].map(role => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedRoles(selectedRoles.filter(r => r !== role));
                          } else {
                            setSelectedRoles([...selectedRoles, role]);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority Skills */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Key Skills to Target
                </label>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'Machine Learning', 'SQL', 'Figma', 'Docker', 'AWS', 'Flutter', 'Arduino'].map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          } else {
                            setSelectedSkills([...selectedSkills, skill]);
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Optimizing Pool...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Synthesize Ideal Team
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* RESULTS DISPLAY */
            <div className="space-y-6">
              {/* Predicted Metrics Banner */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Predicted Team Balance
                  </span>
                  <span className="text-3xl font-black text-emerald-400">{result.predictedTeamBalance}%</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Predicted Hackathon Readiness
                  </span>
                  <span className="text-3xl font-black text-indigo-400">{result.predictedHackathonReadiness}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                {result.summary}
              </p>

              {/* Roster list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recommended Roster Allocation
                </h4>
                {result.roleAssignments.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-800/50">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{item.candidate.full_name}</span>
                          <span className="text-xs text-slate-400 font-medium">({item.candidate.department})</span>
                        </div>
                        <span className="text-xs text-indigo-400 font-semibold block">
                          Assigned: {item.targetRole}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-400 block">{item.matchScore}%</span>
                      <span className="text-[10px] text-slate-400 uppercase">Match Score</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  ← Modify Parameters
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
