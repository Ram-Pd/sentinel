import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, Shield, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import axios from 'axios';

// Component to dynamically change map center/zoom
const MapController = ({ center, zoom, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, bounds, map]);
  return null;
};

// Autocomplete Component
const AddressAutocomplete = ({ placeholder, value, onChange, onSelect, className }) => {
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  let timeoutRef = useRef(null);

  const handleSearch = async (query) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      setResults(res.data);
      setShowDropdown(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => handleSearch(val), 500);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className={className}
        placeholder={placeholder}
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl mt-2 z-[100] max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <li 
              key={i} 
              className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 last:border-0"
              onClick={() => {
                onSelect({ lat: parseFloat(r.lat), lon: parseFloat(r.lon), display_name: r.display_name });
                setShowDropdown(false);
              }}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const PlanRoute = () => {
  const { mockRoutes, startJourney } = useApp();
  const navigate = useNavigate();
  
  const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]);
  const [userLoc, setUserLoc] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  
  const [startInput, setStartInput] = useState('Current Location');
  const [destInput, setDestInput] = useState('');
  
  const [startCoord, setStartCoord] = useState(null);
  const [destCoord, setDestCoord] = useState(null);
  
  const [routeLine, setRouteLine] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lon: position.coords.longitude };
          setUserLoc(loc);
          setMapCenter([loc.lat, loc.lon]);
          if (startInput === 'Current Location') {
            setStartCoord(loc);
          }
        },
        () => console.warn("Location denied")
      );
    }
  }, []);

  const calculateRoute = async (e) => {
    e.preventDefault();
    if (!startCoord || !destCoord) {
      alert("Please select valid locations from the dropdown");
      return;
    }
    
    setIsSearching(true);
    
    try {
      // OSRM API expects lon,lat
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoord.lon},${startCoord.lat};${destCoord.lon},${destCoord.lat}?overview=full&geometries=geojson`;
      const res = await axios.get(osrmUrl);
      
      if (res.data.routes && res.data.routes.length > 0) {
        const route = res.data.routes[0];
        // Convert GeoJSON [lon, lat] to Leaflet [lat, lon]
        const latLngs = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteLine(latLngs);
        setMapBounds(latLngs);
        
        // Format distance and duration
        const distKm = (route.distance / 1000).toFixed(1) + ' km';
        const durMins = Math.round(route.duration / 60) + ' mins';
        
        // Merge with mock safety data
        const mappedRoutes = mockRoutes.slice(0, 1).map((mockData, index) => ({
          ...mockData,
          id: 'route_1',
          name: 'Fastest Safe Route',
          start: startInput,
          end: destInput,
          distance: distKm,
          time: durMins,
        }));
        
        setRoutesData(mappedRoutes);
      }
    } catch (error) {
      console.error("Routing error:", error);
      alert("Could not calculate directions.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartJourney = (route) => {
    startJourney(route);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={mapCenter} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />
          <MapController center={mapCenter} bounds={mapBounds} />
          {startCoord && <Marker position={[startCoord.lat, startCoord.lon]} />}
          {destCoord && <Marker position={[destCoord.lat, destCoord.lon]} />}
          {routeLine.length > 0 && (
            <Polyline positions={routeLine} color="#10b981" weight={5} opacity={0.8} />
          )}
        </MapContainer>
      </div>

      {/* Overlay UI */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        
        {/* Search Header */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 pt-6 shadow-sm border-b border-slate-200 dark:border-slate-800 rounded-b-3xl pointer-events-auto">
          <form onSubmit={calculateRoute} className="space-y-3">
            <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-2 px-3 relative z-50">
              <div className="w-4 h-4 rounded-full border-4 border-primary shrink-0"></div>
              <AddressAutocomplete 
                placeholder="Start location"
                value={startInput}
                onChange={setStartInput}
                onSelect={(loc) => {
                  setStartInput(loc.display_name.split(',')[0]);
                  setStartCoord(loc);
                }}
                className="bg-transparent w-full outline-none text-sm font-medium dark:text-white"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 px-3 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all relative z-40">
              <MapPin size={18} className="text-danger shrink-0" />
              <AddressAutocomplete 
                placeholder="Where to?"
                value={destInput}
                onChange={setDestInput}
                onSelect={(loc) => {
                  setDestInput(loc.display_name.split(',')[0]);
                  setDestCoord(loc);
                }}
                className="bg-transparent w-full outline-none text-sm font-medium dark:text-white"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSearching}
              className="w-full bg-slate-900 dark:bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <Search size={18} />
              <span>{isSearching ? 'Calculating...' : 'Find Safe Routes'}</span>
            </button>
          </form>
        </div>

        {/* Route Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pointer-events-none">
          {routesData.length > 0 && !selectedRoute && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto"
            >
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 drop-shadow-md">
                Recommended Routes
              </h3>
              
              <div className="space-y-4 pb-10">
                {routesData.map((route, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
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
            className="absolute inset-x-0 bottom-0 top-1/3 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col pointer-events-auto"
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
