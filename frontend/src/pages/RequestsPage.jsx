import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestsApi } from '../services/api';
import { RequestCard } from '../components/RequestCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { Inbox, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function RequestsPage() {
  const { user, profile, refreshTeams } = useAuth();
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [activeTab, setActiveTab] = useState('incoming');
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await requestsApi.getRequests();
      setRequests(res);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleStatusUpdate(requestId, newStatus) {
    try {
      const res = await requestsApi.updateRequestStatus(requestId, newStatus);
      alert(`Request has been ${newStatus}! Team roster and analytics have been updated.`);
      await loadRequests();
      if (profile) await refreshTeams(profile.id);
    } catch (err) {
      alert(err.message || 'Failed to update request.');
    }
  }

  if (loading) return <LoadingState message="Fetching teammate invitations..." />;

  const currentList = activeTab === 'incoming' ? requests.incoming : requests.outgoing;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
          Communication Hub
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Teammate Requests
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review incoming invitations and manage your outgoing applications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'incoming'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests ({requests.incoming.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'outgoing'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests ({requests.outgoing.length})</span>
        </button>
      </div>

      {/* Requests List */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={activeTab === 'incoming' ? "You Don't Have Any Pending Teammate Requests" : "No Outgoing Requests"}
          description={
            activeTab === 'incoming'
              ? "When other students or team leaders invite you to their roster, invitations will appear here."
              : "Discover candidate profiles and send invitations to form your hackathon roster."
          }
          actionText={activeTab === 'outgoing' ? "Find Candidates" : undefined}
          actionLink={activeTab === 'outgoing' ? "/students" : undefined}
        />
      ) : (
        <div className="space-y-3">
          {currentList.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              isIncoming={activeTab === 'incoming'}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
