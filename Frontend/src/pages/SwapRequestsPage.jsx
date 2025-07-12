import React, { useState } from 'react';

const sampleRequests = [
  { id: 1, user: 'Marc Demo', skill: 'Photoshop', status: 'Pending' },
  { id: 2, user: 'Michell', skill: 'Excel', status: 'Accepted' },
  { id: 3, user: 'Joe Vills', skill: 'Python', status: 'Rejected' },
];

const statusColors = {
  Pending: { bg: 'rgba(178, 58, 199, 0.2)', text: '#7B1FA2' },
  Accepted: { bg: 'rgba(34, 197, 94, 0.2)', text: '#16a34a' },
  Rejected: { bg: 'rgba(239, 68, 68, 0.2)', text: '#dc2626' },
};

export default function SwapRequestsPage() {
  const [requests, setRequests] = useState(sampleRequests);
  
  const handleAction = (id, action) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: action } : r));
  };
  
  const handleDelete = id => {
    setRequests(reqs => reqs.filter(r => r.id !== id));
  };

  const pageStyle = {
    minHeight: '80vh',
    backgroundColor: '#E1BEE7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2.5rem 0'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '42rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    border: '1px solid rgba(178, 58, 199, 0.2)'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    color: '#7B1FA2',
    textAlign: 'center'
  };

  const requestsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const noRequestsStyle = {
    textAlign: 'center',
    color: 'rgba(178, 58, 199, 0.6)',
    fontSize: '1rem',
    fontStyle: 'italic'
  };

  const requestCardStyle = {
    border: '1px solid rgba(178, 58, 199, 0.3)',
    backgroundColor: '#E1BEE7',
    borderRadius: '8px',
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease'
  };

  const requestInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  };

  const userNameStyle = {
    fontWeight: '600',
    color: '#7B1FA2',
    fontSize: '1rem'
  };

  const skillTextStyle = {
    fontSize: '0.875rem',
    color: '#666'
  };

  const skillHighlightStyle = {
    fontWeight: '500',
    color: '#7B1FA2'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: statusColors[status].bg,
    color: statusColors[status].text
  });

  const actionsContainerStyle = {
    display: 'flex',
    gap: '0.5rem'
  };

  const acceptButtonStyle = {
    background: 'linear-gradient(135deg, #7B1FA2 0%, #B23AC7 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem'
  };

  const rejectButtonStyle = {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem'
  };

  const deleteButtonStyle = {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    padding: '0.25rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem'
  };

  const buttonHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Swap Requests</h1>
        <div style={requestsContainerStyle}>
          {requests.length === 0 && <div style={noRequestsStyle}>No requests.</div>}
          {requests.map(r => (
            <div key={r.id} style={requestCardStyle}>
              <div style={requestInfoStyle}>
                <div style={userNameStyle}>{r.user}</div>
                <div style={skillTextStyle}>
                  Skill: <span style={skillHighlightStyle}>{r.skill}</span>
                </div>
                <span style={statusBadgeStyle(r.status)}>Status: {r.status}</span>
              </div>
              <div style={actionsContainerStyle}>
                {r.status === 'Pending' && (
                  <>
                    <button 
                      style={acceptButtonStyle}
                      onClick={() => handleAction(r.id, 'Accepted')}
                      onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Accept
                    </button>
                    <button 
                      style={rejectButtonStyle}
                      onClick={() => handleAction(r.id, 'Rejected')}
                      onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button 
                  style={deleteButtonStyle}
                  onClick={() => handleDelete(r.id)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#d1d5db';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 