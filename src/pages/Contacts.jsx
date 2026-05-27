import React, { useState } from 'react';
import { UserPlus, Phone, MessageSquare, Shield, ShieldOff, MoreVertical, Edit2, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Contacts = () => {
  const { contacts, setContacts } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: 'friend', isTracking: true });
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const toggleTracking = (id) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, isTracking: !c.isTracking } : c
    ));
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { ...newContact, id: Date.now(), lastSeen: 'Just now' }]);
      setShowAddForm(false);
      setNewContact({ name: '', phone: '', relationship: 'friend', isTracking: true });
    }
  };

  const startEditing = (contact) => {
    setEditingId(contact.id);
    setEditForm({ ...contact });
  };

  const saveEdit = () => {
    setContacts(contacts.map(c => c.id === editingId ? editForm : c));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
    setEditingId(null);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 pt-2">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Trusted Contacts</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary/20 transition-colors"
        >
          <UserPlus size={20} />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddContact} className="glass-panel p-4 rounded-2xl mb-6 space-y-4 shadow-lg border-primary/30 border">
          <h3 className="font-semibold text-sm dark:text-white mb-2">Add New Contact</h3>
          <input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/50 dark:text-white"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/50 dark:text-white"
            required
          />
          <select
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/50 dark:text-white"
          >
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="work">Work/Colleague</option>
          </select>
          <div className="flex space-x-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2 text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 py-2 text-sm font-medium text-white bg-primary rounded-xl">Add</button>
          </div>
        </form>
      )}

      <div className="space-y-4 flex-1 overflow-y-auto pb-4 pr-1">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            {editingId === contact.id ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm dark:text-white">Edit Contact</h3>
                  <div className="flex space-x-2">
                    <button onClick={saveEdit} className="text-primary hover:bg-primary/10 p-1 rounded-full"><Check size={18} /></button>
                    <button onClick={cancelEdit} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-full"><X size={18} /></button>
                  </div>
                </div>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/50 dark:text-white"
                />
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/50 dark:text-white"
                />
                <select
                  value={editForm.relationship}
                  onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/50 dark:text-white"
                >
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="work">Work/Colleague</option>
                </select>
                <button 
                  onClick={() => deleteContact(contact.id)}
                  className="w-full py-2 text-sm font-medium text-danger bg-danger/10 rounded-xl mt-2"
                >
                  Delete Contact
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-primary flex items-center justify-center text-white font-bold text-lg">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{contact.name}</h3>
                      <p className="text-xs text-slate-500 capitalize">{contact.relationship} • {contact.lastSeen}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => startEditing(contact)}
                    className="text-slate-400 hover:text-primary dark:hover:text-primary p-1 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex space-x-2">
                    <button className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => toggleTracking(contact.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      contact.isTracking 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {contact.isTracking ? (
                      <>
                        <Shield size={14} />
                        <span>Tracking Active</span>
                      </>
                    ) : (
                      <>
                        <ShieldOff size={14} />
                        <span>Tracking Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
