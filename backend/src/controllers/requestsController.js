const db = require('../database/db');
const { getFullTeamById, getFullProfileById } = require('../database/helpers');

function sendRequest(req, res) {
  const senderProfileId = req.user.profileId;
  const { teamId, receiverProfileId, requestType = 'team_invite', message = '' } = req.body;

  if (!teamId || !receiverProfileId) {
    return res.status(400).json({ error: 'teamId and receiverProfileId are required.' });
  }

  const team = getFullTeamById(parseInt(teamId, 10));
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  // Check if team is already full
  if (team.members.length >= team.max_size) {
    return res.status(400).json({ error: `Team has reached maximum capacity (${team.max_size} members).` });
  }

  // Check if candidate is already a member
  const isAlreadyMember = team.members.some(m => m.id === parseInt(receiverProfileId, 10));
  if (isAlreadyMember) {
    return res.status(400).json({ error: 'Candidate is already a member of this team.' });
  }

  // Check for duplicate pending requests
  const existingPending = db.prepare(`
    SELECT id FROM requests
    WHERE team_id = ? AND receiver_profile_id = ? AND status = 'pending'
  `).get(teamId, receiverProfileId);

  if (existingPending) {
    return res.status(400).json({ error: 'A pending request already exists for this candidate and team.' });
  }

  try {
    const insertStmt = db.prepare(`
      INSERT INTO requests (team_id, sender_profile_id, receiver_profile_id, request_type, status, message)
      VALUES (?, ?, ?, ?, 'pending', ?)
    `);
    const result = insertStmt.run(teamId, senderProfileId, receiverProfileId, requestType, message.trim());

    return res.status(201).json({
      message: 'Teammate request sent successfully!',
      requestId: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Send request error:', err);
    return res.status(500).json({ error: 'Failed to send request.' });
  }
}

function getRequests(req, res) {
  const profileId = req.user.profileId;

  // Incoming requests (either invite to this user OR join request to a team this user leads)
  const incoming = db.prepare(`
    SELECT r.*, t.name as team_name, t.max_size,
           sp.full_name as sender_name, sp.avatar_url as sender_avatar, sp.department as sender_dept,
           rp.full_name as receiver_name, rp.avatar_url as receiver_avatar
    FROM requests r
    JOIN teams t ON t.id = r.team_id
    JOIN profiles sp ON sp.id = r.sender_profile_id
    JOIN profiles rp ON rp.id = r.receiver_profile_id
    WHERE (r.receiver_profile_id = ?)
       OR (t.leader_id = ? AND r.request_type = 'join_request')
    ORDER BY r.created_at DESC
  `).all(profileId, profileId);

  // Outgoing requests sent by this user
  const outgoing = db.prepare(`
    SELECT r.*, t.name as team_name,
           rp.full_name as receiver_name, rp.avatar_url as receiver_avatar, rp.department as receiver_dept
    FROM requests r
    JOIN teams t ON t.id = r.team_id
    JOIN profiles rp ON rp.id = r.receiver_profile_id
    WHERE r.sender_profile_id = ?
    ORDER BY r.created_at DESC
  `).all(profileId);

  return res.json({ incoming, outgoing });
}

function updateRequestStatus(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const profileId = req.user.profileId;
  const { status } = req.body; // 'accepted', 'rejected', 'cancelled'

  if (!['accepted', 'rejected', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Status must be accepted, rejected, or cancelled.' });
  }

  const request = db.prepare(`
    SELECT r.*, t.leader_id, t.max_size
    FROM requests r
    JOIN teams t ON t.id = r.team_id
    WHERE r.id = ?
  `).get(requestId);

  if (!request) {
    return res.status(404).json({ error: 'Request not found.' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ error: `This request has already been ${request.status}.` });
  }

  // Authorization check
  if (status === 'cancelled') {
    if (request.sender_profile_id !== profileId && request.leader_id !== profileId) {
      return res.status(403).json({ error: 'Only the sender can cancel this request.' });
    }
  } else {
    // For accepting or rejecting
    if (request.request_type === 'team_invite' && request.receiver_profile_id !== profileId) {
      return res.status(403).json({ error: 'Only the invited candidate can accept or reject this invitation.' });
    }
    if (request.request_type === 'join_request' && request.leader_id !== profileId) {
      return res.status(403).json({ error: 'Only the team leader can respond to join requests.' });
    }
  }

  try {
    const handleTx = db.transaction(() => {
      if (status === 'accepted') {
        const team = getFullTeamById(request.team_id);
        if (team.members.length >= team.max_size) {
          throw new Error(`Team is already full (${team.max_size}/${team.max_size} members).`);
        }

        // Determine which profile is being added to the team
        const newMemberId = request.request_type === 'team_invite'
          ? request.receiver_profile_id
          : request.sender_profile_id;

        const candidateProfile = getFullProfileById(newMemberId);
        const primaryRole = (candidateProfile.roles && candidateProfile.roles[0])
          ? candidateProfile.roles[0].name
          : 'Teammate';

        // Add to team_members
        db.prepare(`
          INSERT INTO team_members (team_id, profile_id, role_in_team)
          VALUES (?, ?, ?)
        `).run(request.team_id, newMemberId, primaryRole);
      }

      // Update request status
      db.prepare(`
        UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(status, requestId);
    });

    handleTx();

    const updatedTeam = getFullTeamById(request.team_id);
    return res.json({
      message: `Request successfully ${status}!`,
      status,
      team: updatedTeam
    });
  } catch (err) {
    console.error('Request status update error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update request status.' });
  }
}

module.exports = {
  sendRequest,
  getRequests,
  updateRequestStatus
};
