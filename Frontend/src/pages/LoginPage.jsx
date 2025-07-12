import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: handle login
    alert('Login not implemented');
  };

  const pageStyle = {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1BEE7'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '28rem',
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

  const forgotPasswordStyle = {
    textAlign: 'right',
    fontSize: '0.875rem',
    color: '#7B1FA2',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Login</h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input 
            style={inputStyle}
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(178, 58, 199, 0.4)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input 
            style={inputStyle}
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(178, 58, 199, 0.4)';
              e.target.style.boxShadow = 'none';
            }}
          />
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
            Login
          </button>
          <div 
            style={forgotPasswordStyle}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Forgot username/password?
          </div>
        </form>
      </div>
    </div>
  );
} 