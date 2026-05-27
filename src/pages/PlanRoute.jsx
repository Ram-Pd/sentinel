import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, Shield, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PlanRoute = () => {
  const { mockRoutes, startJourney } = useApp();
  const navigate = useNavigate();
  const [start, setStart] = useState('Current Location');
  const [destination, setDestination] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination) setIsSearching(true);
  };

  const handleStartJourney = (route) => {
    startJourney(route);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Map Mockup Background */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blue-100/50"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Search Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 pt-6 shadow-sm border-b border-slate-200 dark:border-slate-800 rounded-b-3xl">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-2 px-3">
              <div className="w-4 h-4 rounded-full border-4 border-primary"></div>
              <input
                type="text"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="bg-transparent w-full outline-none text-sm font-medium dark:text-white"
                placeholder="Start location"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 px-3 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <MapPin size={18} className="text-danger" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent w-full outline-none text-sm font-medium dark:text-white"
                placeholder="Where to?"
                autoFocus
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-slate-900 dark:bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <Search size={18} />
              <span>Find Safe Routes</span>
            </button>
          </form>
        </div>

        {/* Route Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Recommended Routes
              </h3>
              
              <div className="space-y-4 pb-10">
                {mockRoutes.map((route, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold dark:text-white">{route.name}</h4>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex space-x-3">
                          <span>{route.time}</span>
                          <span>•</span>
                          <span>{route.distance}</span>
                        </div>
                      </div>
                      <div className={`flex flex-col items-end ${route.color}`}>
                        <div className="flex items-center space-x-1 font-bold text-lg font-display">
                          <Shield size={16} fill="currentColor" />
                          <span>{route.safetyScore}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Safety Score</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {route.riskFactors.slice(0, 2).map((factor, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                          {factor}
                        </span>
                      ))}
                      {route.riskFactors.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                          +{route.riskFactors.length - 2} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Route Details Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 top-12 z-40 bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-start px-6 pt-2 pb-4">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{selectedRoute.name}</h2>
                <p className="text-slate-500">{selectedRoute.time} • {selectedRoute.distance}</p>
              </div>
              <button 
                onClick={() => setSelectedRoute(null)}
                className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24">
              {/* Safety Analysis */}
              <div className={`p-4 rounded-2xl mb-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800`}>
                <div className="flex items-center space-x-2 mb-3">
                  <Info size={18} className={selectedRoute.color} />
                  <h3 className="font-semibold dark:text-white">Safety Analysis</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Lighting</p>
                    <p className="font-medium dark:text-slate-200">{selectedRoute.lighting}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Crowd</p>
                    <p className="font-medium dark:text-slate-200">{selectedRoute.crowdDensity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">History</p>
                    <p className="font-medium dark:text-slate-200">{selectedRoute.crimeRate} Risk</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium mb-2 dark:text-slate-200">Risk Factors:</p>
                  <ul className="space-y-1">
                    {selectedRoute.riskFactors.map((factor, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center before:content-['•'] before:mr-2 before:text-slate-400">
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartJourney(selectedRoute)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                <Navigation size={20} className="fill-current" />
                <span>Start Safe Journey</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
