import React, { useState } from 'react';
import UserCard from '../components/UserCard';

const sampleUsers = [
  { id: 1, name: 'Marc Demo', skillsOffered: ['Photoshop'], skillsWanted: ['Excel'], rating: 3.8, availability: 'weekends', profilePhoto: '' },
  { id: 2, name: 'Michell', skillsOffered: ['Excel'], skillsWanted: ['Photoshop'], rating: 2.5, availability: 'evenings', profilePhoto: '' },
  { id: 3, name: 'Joe Vills', skillsOffered: ['Python'], skillsWanted: ['JavaScript'], rating: 4.2, availability: 'weekends', profilePhoto: '' },
];

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const width = useWindowWidth();
  const filteredUsers = sampleUsers.filter(u =>
    u.skillsOffered.join(' ').toLowerCase().includes(search.toLowerCase()) ||
    u.skillsWanted.join(' ').toLowerCase().includes(search.toLowerCase())
  );

  // Responsive breakpoints
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;

  const pageStyle = {
    minHeight: '80vh',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: isMobile ? '1rem 0' : isTablet ? '1.5rem 0' : '2.5rem 0'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: isMobile ? '98vw' : isTablet ? '90vw' : '38rem',
    backgroundColor: 'white',
    borderRadius: isMobile ? '8px' : '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    padding: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    border: '1px solid rgba(178, 58, 199, 0.15)'
  };

  const titleStyle = {
    fontSize: isMobile ? '1.3rem' : isTablet ? '1.7rem' : '2.2rem',
    fontWeight: '800',
    marginBottom: isMobile ? '1rem' : '1.5rem',
    color: '#7B1FA2',
    textAlign: 'center'
  };

  const searchContainerStyle = {
    position: 'relative',
    marginBottom: isMobile ? '1.2rem' : '2rem',
    width: '100%'
  };

  const searchInputStyle = {
    border: '1.5px solid #B23AC7',
    padding: isMobile ? '0.4rem 0.4rem 0.4rem 2rem' : '0.5rem 0.5rem 0.5rem 2.2rem',
    borderRadius: '8px',
    width: '95%',
    fontSize: isMobile ? '0.95rem' : '1rem',
    backgroundColor: '#E1BEE7',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(178,58,199,0.07)'
  };

  const searchInputFocusStyle = {
    borderColor: '#7B1FA2',
    boxShadow: '0 0 0 2px #B23AC7'
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: isMobile ? '1rem' : '1.1rem',
    height: isMobile ? '1rem' : '1.1rem',
    color: '#B23AC7',
    opacity: 0.7
  };

  const usersContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '0.7rem' : '1.25rem'
  };

  const noResultsStyle = {
    textAlign: 'center',
    color: 'rgba(178, 58, 199, 0.6)',
    fontSize: isMobile ? '0.95rem' : '1rem',
    fontStyle: 'italic'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Browse Users</h1>
        <div style={searchContainerStyle}>
          <input
            style={searchInputStyle}
            placeholder="Search by skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => Object.assign(e.target.style, searchInputFocusStyle)}
            onBlur={e => {
              e.target.style.borderColor = '#B23AC7';
              e.target.style.boxShadow = '0 2px 8px rgba(178,58,199,0.07)';
            }}
          />
          <svg style={searchIconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div style={usersContainerStyle}>
          {filteredUsers.length === 0 && <div style={noResultsStyle}>No users found.</div>}
          {filteredUsers.map(user => <UserCard key={user.id} user={user} isMobile={isMobile} isTablet={isTablet} />)}
        </div>
      </div>
    </div>
  );
} 