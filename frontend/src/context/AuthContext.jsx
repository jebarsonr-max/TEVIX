import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, teamsApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    async function loadSession() {
      const token = localStorage.getItem('tevix_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        if (res.profile) {
          setProfile(res.profile);
          setUser({
            id: res.profile.user_id,
            email: res.profile.email,
            profileId: res.profile.id
          });
          // Load teams
          await refreshTeams(res.profile.id);
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        localStorage.removeItem('tevix_token');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  async function refreshTeams(profileId) {
    try {
      const res = await teamsApi.getTeams(true);
      const teams = res.teams || [];
      setUserTeams(teams);
      if (teams.length > 0) {
        // Set first team or keep existing if still valid
        setActiveTeam(prev => {
          if (prev) {
            const found = teams.find(t => t.id === prev.id);
            return found || teams[0];
          }
          return teams[0];
        });
      } else {
        setActiveTeam(null);
      }
    } catch (err) {
      console.error('Error fetching user teams:', err);
    }
  }

  async function login(email, password) {
    const res = await authApi.login({ email, password });
    localStorage.setItem('tevix_token', res.token);
    setUser({
      id: res.user.userId,
      email: res.user.email,
      profileId: res.user.profile?.id
    });
    setProfile(res.user.profile);
    if (res.user.profile?.id) {
      await refreshTeams(res.user.profile.id);
    }
    return res;
  }

  async function register(data) {
    const res = await authApi.register(data);
    localStorage.setItem('tevix_token', res.token);
    setUser({
      id: res.user.userId,
      email: res.user.email,
      profileId: res.user.profile?.id
    });
    setProfile(res.user.profile);
    if (res.user.profile?.id) {
      await refreshTeams(res.user.profile.id);
    }
    return res;
  }

  function logout() {
    localStorage.removeItem('tevix_token');
    setUser(null);
    setProfile(null);
    setActiveTeam(null);
    setUserTeams([]);
  }

  function updateActiveTeam(team) {
    setActiveTeam(team);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        activeTeam,
        userTeams,
        loading,
        login,
        register,
        logout,
        refreshTeams,
        updateActiveTeam,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
