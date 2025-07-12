import React from 'react';

export default function UserCard({ user, isMobile, isTablet }) {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: isMobile ? '8px' : '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: isMobile ? '1rem' : '1.5rem',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    justifyContent: 'space-between',
    border: '1px solid rgba(178, 58, 199, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    gap: isMobile ? '1rem' : '0'
  };

  const cardHoverStyle = {
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    transform: isMobile ? 'none' : 'translateY(-2px)'
  };

  const avatarContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    justifyContent: isMobile ? 'center' : 'flex-start',
    marginBottom: isMobile ? '0.5rem' : 0
  };

  const avatarStyle = {
    width: isMobile ? '44px' : '56px',
    height: isMobile ? '44px' : '56px',
    backgroundColor: 'rgba(178, 58, 199, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '1.1rem' : '1.5rem',
    fontWeight: 'bold',
    color: '#7B1FA2',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const userInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    alignItems: isMobile ? 'center' : 'flex-start',
    textAlign: isMobile ? 'center' : 'left'
  };

  const userNameStyle = {
    fontWeight: '600',
    fontSize: isMobile ? '1rem' : '1.125rem',
    color: '#7B1FA2'
  };

  const skillTextStyle = {
    fontSize: isMobile ? '0.7rem' : '0.75rem',
    color: '#666'
  };

  const skillHighlightStyle = {
    fontWeight: '500',
    color: '#7B1FA2'
  };

  const skillWantedStyle = {
    fontWeight: '500',
    color: '#B23AC7'
  };

  const availabilityStyle = {
    fontSize: isMobile ? '0.7rem' : '0.75rem',
    color: '#888'
  };

  const ratingStyle = {
    fontSize: isMobile ? '0.7rem' : '0.75rem',
    color: '#f59e0b'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #7B1FA2 0%, #B23AC7 100%)',
    color: 'white',
    padding: isMobile ? '0.4rem 1.2rem' : '0.5rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: isMobile ? '0.95rem' : '1rem',
    alignSelf: isMobile ? 'center' : 'auto',
    marginTop: isMobile ? '0.5rem' : 0
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(135deg, #B23AC7 0%, #7B1FA2 100%)',
    transform: 'scale(1.05)'
  };

  const handleMouseEnter = (e) => {
    Object.assign(e.currentTarget.style, cardHoverStyle);
    const button = e.currentTarget.querySelector('button');
    if (button) {
      Object.assign(button.style, buttonHoverStyle);
    }
  };

  const handleMouseLeave = (e) => {
    Object.assign(e.currentTarget.style, cardStyle);
    const button = e.currentTarget.querySelector('button');
    if (button) {
      button.style.background = 'linear-gradient(135deg, #7B1FA2 0%, #B23AC7 100%)';
      button.style.transform = 'scale(1)';
    }
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={avatarContainerStyle}>
        <div style={avatarStyle}>
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" style={{ width: isMobile ? '44px' : '56px', height: isMobile ? '44px' : '56px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            user.name[0]
          )}
        </div>
        <div style={userInfoStyle}>
          <div style={userNameStyle}>{user.name}</div>
          <div style={skillTextStyle}>
            Offered: <span style={skillHighlightStyle}>{user.skillsOffered.join(', ')}</span>
          </div>
          <div style={skillTextStyle}>
            Wanted: <span style={skillWantedStyle}>{user.skillsWanted.join(', ')}</span>
          </div>
          <div style={availabilityStyle}>Availability: {user.availability}</div>
          <div style={ratingStyle}>Rating: {user.rating}</div>
        </div>
      </div>
      <button style={buttonStyle}>Request</button>
    </div>
  );
} 