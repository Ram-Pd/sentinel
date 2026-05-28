import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Bell, Shield, LogOut, ChevronRight, User, X, Check, Droplet, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Profile = () => {
  const { user, logout, updateUser, isDarkMode, setIsDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user || {});

  useEffect(() => {
    if (location.state?.isNewUser) {
      setIsEditing(true);
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    await updateUser(editForm);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
        <div className="flex justify-between items-center mb-6 pt-2">
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Edit Profile</h1>
          <button 
            onClick={() => setIsEditing(false)}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-20 no-scrollbar">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src={user?.profilePic} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-primary/20"
              />
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900">
                <User size={14} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary dark:text-white transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary dark:text-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Blood Group</label>
              <div className="relative">
                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 text-danger opacity-70" size={16} />
                <select
                  value={editForm.blood_group || ''}
                  onChange={(e) => setEditForm({...editForm, blood_group: e.target.value})}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary dark:text-white transition-colors appearance-none"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  value={editForm.dob || ''}
                  onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea
                  rows="3"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary dark:text-white transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center text-warning">
                <AlertTriangle size={14} className="mr-1" /> Emergency Medical Info
              </label>
              <textarea
                rows="2"
                placeholder="E.g., Allergies, chronic conditions"
                value={editForm.emergency_medical || ''}
                onChange={(e) => setEditForm({...editForm, emergency_medical: e.target.value})}
                className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary dark:text-white transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <button 
            onClick={handleSaveProfile}
            className="w-full py-4 mt-6 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-primary/30"
          >
            <Check size={20} />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div className="flex justify-between items-center mb-6 pt-2">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-4 no-scrollbar">
        {/* Profile Card */}
        <div className="glass-panel p-5 rounded-3xl flex items-center space-x-4">
          <img 
            src={user?.profilePic} 
            alt="Profile" 
            className="w-16 h-16 rounded-full border-2 border-primary/20"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold dark:text-white">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.phone}</p>
            <div className="flex space-x-2 mt-1">
              {user?.blood_group && (
                <span className="text-xs font-bold bg-danger/10 text-danger px-2 py-0.5 rounded flex items-center">
                  <Droplet size={10} className="mr-1" fill="currentColor" /> {user.blood_group}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Safety Preferences */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-2">Safety Preferences</h3>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">Auto-share Location</p>
                  <p className="text-xs text-slate-500">When entering high-risk zones</p>
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-primary" defaultChecked />
                <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer"></label>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">SOS Sensitivity</p>
                  <p className="text-xs text-slate-500">Shake device to trigger SOS</p>
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-primary" />
                <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-2">App Settings</h3>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-700 dark:text-slate-300">
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">Theme Appearance</p>
              </div>
              <div className="text-xs font-medium text-slate-500 flex items-center">
                {isDarkMode ? 'Dark' : 'Light'}
                <ChevronRight size={16} className="ml-1" />
              </div>
            </button>
            
            <button 
              onClick={() => {
                setEditForm(user || {});
                setIsEditing(true);
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-700 dark:text-slate-300">
                  <User size={20} />
                </div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">Edit Profile</p>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full py-4 rounded-xl font-semibold bg-danger/10 text-danger hover:bg-danger/20 transition-colors flex items-center justify-center space-x-2 mt-4"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
          right: 0;
          border-color: #10b981;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #10b981;
        }
      `}} />
    </div>
  );
};
