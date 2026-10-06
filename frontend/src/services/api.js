const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('tevix_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed (${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

// Auth API
export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => apiRequest('/auth/me')
};

// Profile API
export const profileApi = {
  getProfile: () => apiRequest('/profile'),
  updateProfile: (profileData) => apiRequest('/profile', { method: 'PUT', body: JSON.stringify(profileData) })
};

// Students API
export const studentsApi = {
  getStudents: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    return apiRequest(`/students?${query.toString()}`);
  },
  getStudentById: (id, teamId) => {
    const query = teamId ? `?teamId=${teamId}` : '';
    return apiRequest(`/students/${id}${query}`);
  }
};

// Teams API
export const teamsApi = {
  getTeams: (userOnly = false) => apiRequest(`/teams${userOnly ? '?userOnly=true' : ''}`),
  getTeamById: (id) => apiRequest(`/teams/${id}`),
  createTeam: (teamData) => apiRequest('/teams', { method: 'POST', body: JSON.stringify(teamData) }),
  updateTeam: (id, teamData) => apiRequest(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(teamData) }),
  getTeamGaps: (id) => apiRequest(`/teams/${id}/gaps`),
  getTeamBalance: (id) => apiRequest(`/teams/${id}/balance`),
  getTeamDna: (id) => apiRequest(`/teams/${id}/dna`),
  getTeamRisks: (id) => apiRequest(`/teams/${id}/risks`),
  getTeamReadiness: (id) => apiRequest(`/teams/${id}/readiness`),
  simulateCandidate: (teamId, candidateId) => apiRequest(`/teams/${teamId}/simulate/${candidateId}`),
  removeMember: (teamId, memberId) => apiRequest(`/teams/${teamId}/members/${memberId}`, { method: 'DELETE' })
};

// Requests API
export const requestsApi = {
  getRequests: () => apiRequest('/requests'),
  sendRequest: (reqData) => apiRequest('/requests', { method: 'POST', body: JSON.stringify(reqData) }),
  updateRequestStatus: (id, status) => apiRequest(`/requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) })
};

// Metadata & Tools
export const metadataApi = {
  getMetadata: () => apiRequest('/metadata'),
  buildIdealTeam: (criteria) => apiRequest('/ideal-team', { method: 'POST', body: JSON.stringify(criteria) })
};
