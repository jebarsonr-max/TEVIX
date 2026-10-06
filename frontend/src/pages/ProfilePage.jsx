import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi, metadataApi } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { User, Save, CheckCircle2, AlertCircle, Award, Clock, Mail } from 'lucide-react';

export function ProfilePage() {
  const { user, profile, setProfile } = useAuth();
  const [metadata, setMetadata] = useState({ skills: [], roles: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    avatarUrl: '',
    department: 'CSE',
    year: 3,
    gender: 'Male',
    contactPreference: 'Email',
    experienceLevel: 'Intermediate',
    hackathonsCount: 0,
    githubUrl: '',
    linkedinUrl: '',
    bio: '',
    availability: {
      days: 'Weekends',
      timeSlots: 'Evening, Night',
      hoursPerWeek: 15
    }
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [profData, metaData] = await Promise.all([
          profileApi.getProfile(),
          metadataApi.getMetadata()
        ]);
        setMetadata(metaData);
        setFormData({
          fullName: profData.full_name || '',
          avatarUrl: profData.avatar_url || '',
          department: profData.department || 'CSE',
          year: profData.year || 3,
          gender: profData.gender || 'Male',
          contactPreference: profData.contact_preference || 'Email',
          experienceLevel: profData.experience_level || 'Intermediate',
          hackathonsCount: profData.hackathons_count || 0,
          githubUrl: profData.github_url || '',
          linkedinUrl: profData.linkedin_url || '',
          bio: profData.bio || '',
          availability: profData.availability || {
            days: 'Weekends',
            timeSlots: 'Evening, Night',
            hoursPerWeek: 15
          }
        });
        setSelectedSkills(profData.skills?.map(s => s.id) || []);
        setSelectedRoles(profData.roles?.map(r => r.id) || []);
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await profileApi.updateProfile({
        ...formData,
        skills: selectedSkills,
        roles: selectedRoles
      });
      setProfile(res.profile);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState message="Loading your profile data..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
          Account Profile
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          My Student Profile
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Your profile vector determines how TEVIX matching engines evaluate your compatibility with teams.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Department
            </label>
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="AI & DS">AI & DS</option>
              <option value="ECE">ECE</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Year of Study
            </label>
            <select
              value={formData.year}
              onChange={e => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Experience & Hackathons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Hackathons Participated
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={formData.hackathonsCount}
              onChange={e => setFormData({ ...formData, hackathonsCount: parseInt(e.target.value, 10) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Roles Multi-select */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Preferred Roles ({selectedRoles.length} selected)
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

        {/* Skills Multi-select */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Technical Skills ({selectedSkills.length} selected)
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

        {/* Availability Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Available Days
            </label>
            <select
              value={formData.availability.days}
              onChange={e => setFormData({
                ...formData,
                availability: { ...formData.availability, days: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Weekends">Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="All Days">All Days</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Time Slots
            </label>
            <input
              type="text"
              value={formData.availability.timeSlots}
              onChange={e => setFormData({
                ...formData,
                availability: { ...formData.availability, timeSlots: e.target.value }
              })}
              placeholder="e.g. Evening, Night"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Hours Per Week
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={formData.availability.hoursPerWeek}
              onChange={e => setFormData({
                ...formData,
                availability: { ...formData.availability, hoursPerWeek: parseInt(e.target.value, 10) || 15 }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Social URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            Short Bio
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Introduce your engineering background and hackathon interests..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
