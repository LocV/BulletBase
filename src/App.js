import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewLoadDevelopment from './components/NewLoadDevelopment';
import LoadDevelopments from './components/LoadDevelopments';
import NewShootingSession from './components/NewShootingSession';
import SessionLogging from './components/SessionLogging';
import AddFirearm from './components/AddFirearm';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <header className="App-header">
                <Home />
              </header>
            } />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/load/new" element={
              <ProtectedRoute>
                <NewLoadDevelopment />
              </ProtectedRoute>
            } />
            <Route path="/loads" element={
              <ProtectedRoute>
                <LoadDevelopments />
              </ProtectedRoute>
            } />
            <Route path="/session/new" element={
              <ProtectedRoute>
                <NewShootingSession />
              </ProtectedRoute>
            } />
            <Route path="/session/:sessionId" element={
              <ProtectedRoute>
                <SessionLogging />
              </ProtectedRoute>
            } />
            <Route path="/add-firearm" element={
              <ProtectedRoute>
                <AddFirearm />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
