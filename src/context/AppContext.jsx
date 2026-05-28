import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const mockRoutes = [
  { id: 1, name: "Route A - Main Road", start: "Office, Bandra", end: "Home, Andheri", distance: "12 km", time: "35 mins", safetyScore: 92, riskFactors: ["Well-lit", "High traffic", "CCTV present"], crowdDensity: "High", lighting: "Good", crimeRate: "Low", color: "text-primary" },
  { id: 2, name: "Route B - Highway", start: "Office, Bandra", end: "Home, Andheri", distance: "10 km", time: "28 mins", safetyScore: 65, riskFactors: ["Moderate lighting", "Sparse crowd", "Limited surveillance"], crowdDensity: "Medium", lighting: "Moderate", crimeRate: "Moderate", color: "text-warning" },
  { id: 3, name: "Route C - Back Roads", start: "Office, Bandra", end: "Home, Andheri", distance: "9 km", time: "22 mins", safetyScore: 42, riskFactors: ["Poor lighting", "Isolated areas", "Low CCTV coverage"], crowdDensity: "Low", lighting: "Poor", crimeRate: "High", color: "text-danger" }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [contacts, setContacts] = useState([]);
  const [activeJourney, setActiveJourney] = useState(() => JSON.parse(localStorage.getItem('safety_journey')) || null);
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('safety_theme')) || false);
  const [isSOSTriggered, setIsSOSTriggered] = useState(false);
  const [isLocationShared, setIsLocationShared] = useState(false);

  const fetchUserData = async (userId) => {
    // Fetch Profile
    let { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!profile) {
      // Create empty profile if not exists
      const { data: newProfile } = await supabase.from('profiles').insert([{ id: userId }]).select().single();
      profile = newProfile;
    }
    
    // Fetch Contacts
    const { data: contactsData } = await supabase.from('contacts').select('*').eq('user_id', userId);
    
    // Fetch History
    const { data: historyData } = await supabase.from('history').select('*').eq('user_id', userId).order('id', { ascending: false });

    if (profile) setUser(profile);
    if (contactsData) setContacts(contactsData);
    if (historyData) setHistory(historyData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      }
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setContacts([]);
        setHistory([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw error;
    
    // Create initial profile with name
    if (data.user) {
      await supabase.from('profiles').insert([{ 
        id: data.user.id, 
        name: name,
        profile_pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=10b981&color=fff`
      }]);
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setActiveJourney(null);
  };

  const updateUser = async (updatedData) => {
    if (!session) return;
    // Don't send id field if it's there
    const { id, ...dataToUpdate } = updatedData;
    const { data, error } = await supabase.from('profiles').update(dataToUpdate).eq('id', session.user.id).select().single();
    if (data) setUser(data);
  };

  const addContact = async (contact) => {
    if (!session) return;
    const { data, error } = await supabase.from('contacts').insert([{ ...contact, user_id: session.user.id }]).select().single();
    if (data) setContacts([...contacts, data]);
  };

  const updateContact = async (id, updates) => {
    const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select().single();
    if (data) setContacts(contacts.map(c => c.id === id ? data : c));
  };

  const deleteContact = async (id) => {
    await supabase.from('contacts').delete().eq('id', id);
    setContacts(contacts.filter(c => c.id !== id));
  };

  const startJourney = (route) => {
    setActiveJourney({
      ...route,
      startTime: new Date().toISOString(),
      status: 'active'
    });
  };

  const endJourney = async () => {
    if (activeJourney && session) {
      const newHistory = {
        user_id: session.user.id,
        route: activeJourney.name,
        date: new Date().toLocaleString(),
        duration: "Just now",
        safety_rating: 5.0,
        incidents: 0,
        contacts_notified: contacts.filter(c => c.is_tracking).length
      };
      const { data, error } = await supabase.from('history').insert([newHistory]).select().single();
      if (data) setHistory([data, ...history]);
      setActiveJourney(null);
    }
  };

  const recordSosAlert = async (latitude, longitude, mapLink) => {
    if (session) {
      const newAlert = {
        user_id: session.user.id,
        latitude: latitude,
        longitude: longitude,
        google_maps_link: mapLink,
        status: 'active'
      };
      await supabase.from('sos_alerts').insert([newAlert]);
    }
  };

  const triggerSOS = () => setIsSOSTriggered(true);
  const cancelSOS = () => setIsSOSTriggered(false);
  const toggleLocationShare = () => setIsLocationShared(!isLocationShared);

  return (
    <AppContext.Provider value={{
      user, loadingAuth, login, register, logout, updateUser,
      contacts, addContact, updateContact, deleteContact,
      activeJourney, startJourney, endJourney,
      history, mockRoutes,
      isDarkMode, setIsDarkMode,
      isSOSTriggered, triggerSOS, cancelSOS, recordSosAlert,
      isLocationShared, toggleLocationShare
    }}>
      {children}
    </AppContext.Provider>
  );
};
