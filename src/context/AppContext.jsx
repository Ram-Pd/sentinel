import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Mock Data Providers
const defaultUser = {
  id: 1,
  name: "Priya Sharma",
  email: "priya@example.com",
  phone: "+91-9876543210",
  profilePic: "https://ui-avatars.com/api/?name=Priya+Sharma&background=10b981&color=fff",
  safetyScore: 87,
  bloodGroup: "O+",
  address: "123, Green Park, Andheri East, Mumbai",
  dob: "1995-08-15",
  emergencyMedical: "Allergic to Penicillin",
};

const defaultContacts = [
  { id: 1, name: "Mom", relationship: "family", phone: "+91-9123456789", isTracking: true, lastSeen: "2 mins ago" },
  { id: 2, name: "Isha (Best Friend)", relationship: "friend", phone: "+91-8765432109", isTracking: false, lastSeen: "30 mins ago" },
  { id: 3, name: "Office Security", relationship: "work", phone: "1800-SAFETY-1", isTracking: true, lastSeen: "Just now" }
];

const mockRoutes = [
  { id: 1, name: "Route A - Main Road", start: "Office, Bandra", end: "Home, Andheri", distance: "12 km", time: "35 mins", safetyScore: 92, riskFactors: ["Well-lit", "High traffic", "CCTV present"], crowdDensity: "High", lighting: "Good", crimeRate: "Low", color: "text-primary" },
  { id: 2, name: "Route B - Highway", start: "Office, Bandra", end: "Home, Andheri", distance: "10 km", time: "28 mins", safetyScore: 65, riskFactors: ["Moderate lighting", "Sparse crowd", "Limited surveillance"], crowdDensity: "Medium", lighting: "Moderate", crimeRate: "Moderate", color: "text-warning" },
  { id: 3, name: "Route C - Back Roads", start: "Office, Bandra", end: "Home, Andheri", distance: "9 km", time: "22 mins", safetyScore: 42, riskFactors: ["Poor lighting", "Isolated areas", "Low CCTV coverage"], crowdDensity: "Low", lighting: "Poor", crimeRate: "High", color: "text-danger" }
];

const mockHistory = [
  { id: 1, route: "Office to Home", date: "Today, 6:45 PM", duration: "38 mins", safetyRating: 4.8, incidents: 0, contactsNotified: 1 },
  { id: 2, route: "Home to Gym", date: "Yesterday, 6:15 AM", duration: "12 mins", safetyRating: 4.9, incidents: 0, contactsNotified: 0 }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('safety_user')) || null);
  const [contacts, setContacts] = useState(() => JSON.parse(localStorage.getItem('safety_contacts')) || defaultContacts);
  const [activeJourney, setActiveJourney] = useState(() => JSON.parse(localStorage.getItem('safety_journey')) || null);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('safety_history')) || mockHistory);
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('safety_theme')) || false);
  const [isSOSTriggered, setIsSOSTriggered] = useState(false);
  const [isLocationShared, setIsLocationShared] = useState(false);

  useEffect(() => {
    localStorage.setItem('safety_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('safety_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('safety_journey', JSON.stringify(activeJourney));
  }, [activeJourney]);

  useEffect(() => {
    localStorage.setItem('safety_theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const login = (email) => {
    setUser({ ...defaultUser, email });
  };

  const register = (name, email) => {
    setUser({
      id: Date.now(),
      name: name,
      email: email,
      phone: "",
      profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`,
      safetyScore: 100,
      bloodGroup: "",
      address: "",
      dob: "",
      emergencyMedical: "",
    });
  };

  const logout = () => {
    setUser(null);
    setActiveJourney(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const startJourney = (route) => {
    setActiveJourney({
      ...route,
      startTime: new Date().toISOString(),
      status: 'active'
    });
  };

  const endJourney = () => {
    if (activeJourney) {
      setHistory([{
        id: Date.now(),
        route: activeJourney.name,
        date: new Date().toLocaleString(),
        duration: "Just now",
        safetyRating: 5.0,
        incidents: 0,
        contactsNotified: contacts.filter(c => c.isTracking).length
      }, ...history]);
      setActiveJourney(null);
    }
  };

  const triggerSOS = () => setIsSOSTriggered(true);
  const cancelSOS = () => setIsSOSTriggered(false);
  const toggleLocationShare = () => setIsLocationShared(!isLocationShared);

  return (
    <AppContext.Provider value={{
      user, login, register, logout, updateUser,
      contacts, setContacts,
      activeJourney, startJourney, endJourney,
      history, mockRoutes,
      isDarkMode, setIsDarkMode,
      isSOSTriggered, triggerSOS, cancelSOS,
      isLocationShared, toggleLocationShare
    }}>
      {children}
    </AppContext.Provider>
  );
};
