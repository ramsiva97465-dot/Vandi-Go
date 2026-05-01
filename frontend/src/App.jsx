import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Navbar from './components/Navbar';
import InstallPrompt from './components/InstallPrompt';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" replace />;
  
  return children;
};

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith('/driver') ||
                     location.pathname === '/login' ||
                     location.pathname === '/register' ||
                     location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#020617]">
      {!hideNavbar && <Navbar />}
      <InstallPrompt />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/driver/*" 
            element={
              <PrivateRoute role="driver">
                <DriverDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Landing />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
