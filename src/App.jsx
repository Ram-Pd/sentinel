import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { SOSModal } from './components/SOSModal';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PlanRoute } from './pages/PlanRoute';
import { Contacts } from './pages/Contacts';
import { Profile } from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="plan" element={<PlanRoute />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <SOSModal />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="bg-slate-200 dark:bg-slate-900 min-h-screen sm:py-8 font-sans transition-colors duration-300">
          <AppContent />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
