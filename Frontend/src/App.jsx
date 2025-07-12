import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const appStyle = {
    backgroundColor: '#E1BEE7',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden'
  };

  const contentStyle = {
    minHeight: 'calc(100vh - 72px)'
  };

  return (
    <Router>
      <div style={appStyle}>
        <Navbar />
        <div style={contentStyle}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/swaps" element={<SwapRequestsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
