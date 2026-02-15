
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppState, User, UserStatus, AdminRole } from './types';
import { MOCK_USERS, MOCK_PROFILES } from './services/mockData';
import UserApp from './components/UserApp/UserApp';
import AdminApp from './components/AdminApp/AdminApp';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    userProfile: null,
    adminUser: null,
    view: 'user'
  });

  const handleUserLogin = (user: User) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      userProfile: MOCK_PROFILES[user.id] || null,
      view: 'user'
    }));
  };

  const handleAdminLogin = (admin: { id: string; name: string; role: AdminRole }) => {
    setState(prev => ({
      ...prev,
      adminUser: admin,
      view: 'admin'
    }));
  };

  const handleLogout = () => {
    setState({
      currentUser: null,
      userProfile: null,
      adminUser: null,
      view: 'user'
    });
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            state.currentUser ? (
              <Navigate to="/user" replace />
            ) : state.adminUser ? (
              <Navigate to="/admin" replace />
            ) : (
              <LandingPage onUserLogin={handleUserLogin} onAdminLogin={handleAdminLogin} />
            )
          } 
        />
        <Route 
          path="/user/*" 
          element={
            state.currentUser ? (
              <UserApp state={state} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            state.adminUser ? (
              <AdminApp state={state} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
