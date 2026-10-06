import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Compass,
  Layers,
  Inbox,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

export function Navbar({ onOpenIdealTeam }) {
  const { user, profile, activeTeam, userTeams, logout, updateActiveTeam } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Layers, authRequired: true },
    { label: 'Find Teammates', path: '/students', icon: Compass, authRequired: false },
    { label: 'My Teams', path: '/teams', icon: Users, authRequired: true },
    { label: 'Requests', path: '/requests', icon: Inbox, authRequired: true }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-cyan-300 font-black text-lg tracking-wider">
                    T
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  TEVIX
                </span>
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-indigo-400 -mt-1">
                  Team Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                if (link.authRequired && !user) return null;
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Header: Active Team Selector & Profile / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Build Ideal Team Modal Button */}
            {onOpenIdealTeam && (
              <button
                onClick={onOpenIdealTeam}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 transition-colors"
                title="Synthesize an optimal team configuration"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ideal Team AI</span>
              </button>
            )}

            {/* Active Team Dropdown (if user has teams) */}
            {user && userTeams.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="max-w-[120px] truncate">{activeTeam ? activeTeam.name : 'Select Team'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {teamDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">
                      Active Evaluation Team
                    </div>
                    {userTeams.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          updateActiveTeam(t);
                          setTeamDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                          activeTeam?.id === t.id ? 'bg-indigo-950/40 text-indigo-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span className="truncate">{t.name}</span>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                          {t.currentMemberCount || (t.members ? t.members.length : 0)}/{t.max_size}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-slate-800 pt-1">
                      <Link
                        to="/teams/create"
                        onClick={() => setTeamDropdownOpen(false)}
                        className="w-full text-left px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Create New Team
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Logout or Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition-colors group"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white max-w-[100px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'User'}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2">
          {navLinks.map(link => {
            if (link.authRequired && !user) return null;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {user ? (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
              >
                <User className="w-4 h-4" /> My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-900"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-slate-900 text-slate-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
