import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Users, Settings, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
  const { user, triggerSOS } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <Outlet />;
  }

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <Map size={24} />, label: 'Plan', path: '/plan' },
    { icon: <Users size={24} />, label: 'Contacts', path: '/contacts' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/profile' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-2xl sm:rounded-3xl sm:h-[90vh] sm:mt-[5vh] relative border border-slate-200 dark:border-slate-800">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating SOS Button */}
      <div className="absolute bottom-28 right-4 z-40">
        <div className="relative">
          <div className="absolute inset-0 bg-danger rounded-full animate-ping opacity-75"></div>
          <button
            onClick={triggerSOS}
            className="relative bg-danger text-white rounded-full p-4 shadow-lg shadow-danger/50 flex items-center justify-center transform active:scale-95 transition-all"
          >
            <ShieldAlert size={32} />
          </button>
        </div>
      </div>

      {/* Floating Bottom Navigation Pill */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-30 pb-safe pointer-events-none">
        <nav className="glass-panel rounded-full border border-white/40 dark:border-slate-700/50 shadow-xl shadow-slate-300/30 dark:shadow-none pointer-events-auto">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                    isActive ? 'text-primary scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      {item.icon}
                      {isActive && (
                        <motion.div 
                          layoutId="navIndicator"
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                        />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};
