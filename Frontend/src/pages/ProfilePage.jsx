import React, { useState } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsWanted, setSkillsWanted] = useState('');
  const [availability, setAvailability] = useState('weekends');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Save profile
    alert('Profile saved!');
  };

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
    maxWidth: '32rem',
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

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  };

  const fieldContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#7B1FA2',
    marginBottom: '0.25rem'
  };

  const inputStyle = {
    border: '1px solid rgba(178, 58, 199, 0.4)',
    padding: '0.75rem',
    borderRadius: '8px',
    width: '100%',
    fontSize: '1rem',
    backgroundColor: '#E1BEE7',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    borderColor: '#7B1FA2',
    boxShadow: '0 0 0 3px rgba(178, 58, 199, 0.1)'
  };

  const selectStyle = {
    border: '1px solid rgba(178, 58, 199, 0.4)',
    padding: '0.75rem',
    borderRadius: '8px',
    width: '100%',
    fontSize: '1rem',
    backgroundColor: '#E1BEE7',
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const checkboxStyle = {
    width: '1rem',
    height: '1rem',
    accentColor: '#7B1FA2'
  };

  const checkboxLabelStyle = {
    fontSize: '0.875rem',
    color: '#7B1FA2'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #7B1FA2 0%, #B23AC7 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(135deg, #B23AC7 0%, #7B1FA2 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Your Profile</h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Name</label>
            <input 
              style={inputStyle}
              placeholder="Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(178, 58, 199, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Location <span style={{ color: '#999' }}>(optional)</span>
            </label>
            <input 
              style={inputStyle}
              placeholder="Location (optional)" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(178, 58, 199, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Skills Offered</label>
            <input 
              style={inputStyle}
              placeholder="Skills Offered (comma separated)" 
              value={skillsOffered} 
              onChange={e => setSkillsOffered(e.target.value)} 
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(178, 58, 199, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Skills Wanted</label>
            <input 
              style={inputStyle}
              placeholder="Skills Wanted (comma separated)" 
              value={skillsWanted} 
              onChange={e => setSkillsWanted(e.target.value)} 
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(178, 58, 199, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Availability</label>
            <select 
              style={selectStyle}
              value={availability} 
              onChange={e => setAvailability(e.target.value)}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(178, 58, 199, 0.4)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="mornings">Mornings</option>
            </select>
          </div>
          
          <div style={checkboxContainerStyle}>
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={e => setIsPublic(e.target.checked)}
              style={checkboxStyle}
            />
            <span style={checkboxLabelStyle}>Profile Public</span>
          </div>
          
          <button 
            style={buttonStyle}
            type="submit"
            onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #7B1FA2 0%, #B23AC7 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
} 