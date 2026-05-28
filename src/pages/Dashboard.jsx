import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Navigation, Users, ChevronRight, Activity, MapPin, Clock, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Dashboard = () => {
  const { user, activeJourney, history, triggerSOS, isLocationShared, toggleLocationShare, contacts } = useApp();
  const navigate = useNavigate();

  const handleShareLocation = () => {
    if (!isLocationShared) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
            
            const activeContacts = contacts.filter(c => c.is_tracking || c.isTracking);
            if (activeContacts.length > 0) {
              const phoneNumbers = activeContacts.map(c => c.phone).join(',');
              const message = `I am sharing my live location with you for safety: ${mapLink}`;
              window.location.href = `sms:${phoneNumbers}?body=${encodeURIComponent(message)}`;
            } else {
              alert("Please add trusted contacts first!");
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Could not access location.");
          }
        );
      }
    }
    toggleLocationShare();
  };

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <p className="text-sm text-slate-500 font-medium">Good evening, {currentTime}</p>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Hi, {user?.name ? user.name.split(' ')[0] : 'User'}
          </h1>
        </div>
        <img 
          src={user?.profilePic} 
          alt="Profile" 
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-full border-2 border-primary/20 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
        />
      </header>

      {/* Safety Status Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-5 text-white shadow-xl shadow-primary/20 relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Shield size={20} className="text-white" />
            </div>
            <span className="font-medium">Safety Status</span>
          </div>
          <span className="bg-white text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            SECURE
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-sm text-white/80 mb-1">Current Area Score</p>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-display font-bold">{user?.safetyScore}</span>
            <span className="text-white/80 pb-1">/100</span>
          </div>
        </div>
      </motion.div>

      {/* Emergency Actions */}
      <div>
        <h2 className="text-sm font-semibold text-danger uppercase tracking-wider mb-3 px-1">Emergency Actions</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={triggerSOS}
            className="bg-danger hover:bg-red-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-colors shadow-lg shadow-danger/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-500 ease-out origin-center opacity-0 group-hover:opacity-100"></div>
            <div className="bg-white/20 p-3 rounded-full">
              <Shield size={24} />
            </div>
            <span className="text-sm font-bold relative z-10">Trigger SOS</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = 'tel:100'}
            className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-colors shadow-lg"
          >
            <div className="bg-white/20 p-3 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">100</span>
            </div>
            <span className="text-sm font-bold text-center">Call nearby police station</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/plan')}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full">
              <Navigation size={24} />
            </div>
            <span className="text-sm font-medium dark:text-slate-200">Plan Route</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contacts')}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors"
          >
            <div className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 p-3 rounded-full">
              <Users size={24} />
            </div>
            <span className="text-sm font-medium dark:text-slate-200">Trusted Contacts</span>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleShareLocation}
            className={`col-span-2 p-4 rounded-2xl flex items-center justify-center space-x-3 transition-all ${
              isLocationShared 
                ? 'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'glass-panel hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className={`p-2 rounded-full ${isLocationShared ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Radio size={20} />
            </div>
            <span className="text-sm font-bold">
              {isLocationShared ? 'Live Location Sharing Active' : 'Share Live Location'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Active Journey */}
      {activeJourney && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-3 px-1">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
              <Activity size={14} className="mr-1 text-primary animate-pulse" />
              Active Journey
            </h2>
            <span className="text-xs font-medium text-primary">Live Tracking</span>
          </div>
          
          <div className="glass-panel rounded-3xl p-5 border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg dark:text-white">{activeJourney.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                  <MapPin size={12} className="mr-1" /> {activeJourney.end}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-primary">{activeJourney.time}</p>
                <p className="text-xs text-slate-500 uppercase">remaining</p>
              </div>
            </div>
            
            {/* Progress Bar Mock */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                className="bg-primary h-2 rounded-full relative"
              >
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 animate-pulse"></div>
              </motion.div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold">
                    👤
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">3 contacts watching</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Routes */}
      {!activeJourney && (
        <div>
          <div className="flex justify-between items-center mb-3 px-1">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recent Routes</h2>
            <button className="text-xs text-primary font-medium flex items-center">
              View all <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="glass-panel p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                    <Clock size={18} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold dark:text-slate-200">{item.route}</h4>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-primary space-x-1">
                    <span className="font-bold">{item.safetyRating}</span>
                    <Shield size={12} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
