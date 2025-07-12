import React from 'react';

export default function AdminPage() {
  const pageStyle = {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1BEE7',
    padding: '2.5rem 0'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '42rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    textAlign: 'center',
    border: '1px solid rgba(178, 58, 199, 0.2)'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    color: '#7B1FA2'
  };

  const messageStyle = {
    fontSize: '1.125rem',
    color: '#B23AC7',
    fontStyle: 'italic'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <p style={messageStyle}>Admin features coming soon...</p>
      </div>
    </div>
  );
} 