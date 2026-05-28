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

const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useApp();
  
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
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
        <div className="min-h-screen sm:py-8 font-sans transition-colors duration-300 relative z-0">
          <AppContent />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
