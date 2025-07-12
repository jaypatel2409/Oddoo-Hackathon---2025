import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const navbarStyle = {
    backgroundColor: '#2D0636',
    padding: '1rem',
    color: '#E1BEE7',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    fontWeight: 'bold',
    fontSize: '1.125rem',
    letterSpacing: '0.05em'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    marginRight: '2.5rem'
  };

  const linkStyle = {
    color: '#E1BEE7',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  };

  const linkHoverStyle = {
    color: '#7B1FA2'
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>Skill Swap Platform</div>
      <div style={navLinksStyle}>
        <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#7B1FA2'} onMouseLeave={(e) => e.target.style.color = '#E1BEE7'}>Home</Link>
        <Link to="/login" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#7B1FA2'} onMouseLeave={(e) => e.target.style.color = '#E1BEE7'}>Login</Link>
        <Link to="/profile" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#7B1FA2'} onMouseLeave={(e) => e.target.style.color = '#E1BEE7'}>Profile</Link>
        <Link to="/swaps" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#7B1FA2'} onMouseLeave={(e) => e.target.style.color = '#E1BEE7'}>Swap Requests</Link>
        <Link to="/admin" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#7B1FA2'} onMouseLeave={(e) => e.target.style.color = '#E1BEE7'}>Admin</Link>
      </div>
    </nav>
  );
} 