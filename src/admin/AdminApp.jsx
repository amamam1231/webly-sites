import React, { useState, useEffect } from 'react';
import { AdminConfig } from './config';
import { Settings, Users, BarChart3, Mail, Save, LogOut } from 'lucide-react';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState({});
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fallback if AdminConfig is missing or broken
  const config = AdminConfig || { 
    siteName: 'Admin Panel', 
    accentColor: '#3b82f6',
    editableFields: [],
    features: { analytics: true, inbox: true }
  };

  useEffect(() => {
    // In a real app, fetch from D1 database here
    const mockSettings = {};
    config.editableFields?.forEach(field => {
      mockSettings[field.key] = '';
    });
    setSettings(mockSettings);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const renderContent = () => {
    if (activeTab === 'settings') {
      return (
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Site Content</h2>
            <div className="space-y-4">
              {config.editableFields?.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'boolean' ? (
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <input 
                      type={field.type || 'text'} 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
              
              {(!config.editableFields || config.editableFields.length === 0) && (
                <div className="text-gray-500 text-sm italic">
                  No editable fields defined in config.js
                </div>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 font-medium"
            style={{ backgroundColor: config.accentColor }}
          >
            <Save size={18} />
            {loading ? 'Saving...' : (saved ? 'Saved!' : 'Save Changes')}
          </button>
        </form>
      );
    }
    
    if (activeTab === 'inbox' && config.features?.inbox) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Leads & Inquiries</h2>
          </div>
          {leads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>No leads yet. When users submit forms, they will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Lead list would go here */}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Visitors</h3>
          <p className="text-3xl font-bold">1,248</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <span>+12%</span> from last week
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">New Leads</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <span>+4%</span> from last week
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: config.accentColor }}>
            {config.siteName}
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={18} />
            Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings size={18} />
            Site Content
          </button>
          
          {config.features?.inbox && (
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'inbox' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail size={18} />
                Inbox
              </div>
              {leads.length > 0 && (
                <span className="bg-red-500 text-white text-xs py-0.5 px-2 rounded-full font-bold">
                  {leads.length}
                </span>
              )}
            </button>
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">Logged in as Admin</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-sm border-2 border-white"></div>
          </div>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
