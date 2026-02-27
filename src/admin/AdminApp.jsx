import React, { useState, useEffect } from 'react';
import { AdminConfig } from './config';
import { Settings, Users, BarChart3, Mail, Save, LogOut, Database, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState({});
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Collections State
  const [collectionsData, setCollectionsData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [activeCollectionName, setActiveCollectionName] = useState('');

  // Fallback if AdminConfig is missing or broken
  const config = AdminConfig || { 
    siteName: 'Admin Panel', 
    accentColor: '#3b82f6',
    editableFields: [],
    collections: [],
    features: { analytics: true, inbox: true }
  };

  useEffect(() => {
    // Fetch settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          const mergedSettings = {};
          config.editableFields?.forEach(field => {
            let val = data[field.key];
            if (field.type === 'boolean') {
              if (val === 'true') val = true;
              if (val === 'false') val = false;
              mergedSettings[field.key] = val !== undefined ? val : true;
            } else {
              mergedSettings[field.key] = val || '';
            }
          });
          if (data.telegram_chat_id !== undefined) {
            mergedSettings.telegram_chat_id = data.telegram_chat_id;
          }
          setSettings(mergedSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    // Fetch leads
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    
    fetchSettings();
    if (config.features?.inbox) {
      fetchLeads();
    }
  }, []);
  
  // Fetch collection data when tab changes to a collection
  useEffect(() => {
    if (activeTab.startsWith('collection_')) {
      const colName = activeTab.replace('collection_', '');
      setActiveCollectionName(colName);
      fetchCollection(colName);
      setEditingItem(null);
    }
  }, [activeTab]);

  const fetchCollection = async (collectionName) => {
    try {
      const response = await fetch(`/api/collections?name=${collectionName}`);
      if (response.ok) {
        const data = await response.json();
        setCollectionsData(prev => ({...prev, [collectionName]: data}));
      }
    } catch (error) {
      console.error(`Error fetching collection ${collectionName}:`, error);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveCollectionItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          collectionName: activeCollectionName,
          item: editingItem
        })
      });
      if (response.ok) {
        await fetchCollection(activeCollectionName);
        setEditingItem(null);
      }
    } catch (error) {
      alert('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollectionItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          collectionName: activeCollectionName,
          item: { id }
        })
      });
      if (response.ok) {
        await fetchCollection(activeCollectionName);
      }
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const renderCollectionForm = (collectionDef) => {
    return (
      <form onSubmit={handleSaveCollectionItem} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editingItem.id ? 'Edit Item' : 'New Item'}
          </h2>
          <button type="button" onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {collectionDef.fields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === 'boolean' ? (
                <input 
                  type="checkbox" 
                  checked={!!editingItem[field.key]}
                  onChange={(e) => setEditingItem({...editingItem, [field.key]: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              ) : field.type === 'textarea' ? (
                <textarea 
                  value={editingItem[field.key] || ''}
                  onChange={(e) => setEditingItem({...editingItem, [field.key]: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                />
              ) : (
                <input 
                  type={field.type || 'text'} 
                  value={editingItem[field.key] || ''}
                  onChange={(e) => setEditingItem({...editingItem, [field.key]: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium flex items-center gap-2" style={{ backgroundColor: config.accentColor }}>
            <Save size={16} /> Save Item
          </button>
        </div>
      </form>
    );
  };

  const renderContent = () => {
    if (activeTab === 'settings') {
      return (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
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
                      checked={!!settings[field.key]}
                      onChange={(e) => handleSettingChange(field.key, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <input 
                      type={field.type || 'text'} 
                      value={settings[field.key] || ''}
                      onChange={(e) => handleSettingChange(field.key, e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>
              ))}
              
              {(!config.editableFields || config.editableFields.length === 0) && (
                <div className="text-gray-500 text-sm italic">No editable fields defined in config.js</div>
              )}
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium" style={{ backgroundColor: config.accentColor }}>
            <Save size={18} /> {loading ? 'Saving...' : (saved ? 'Saved!' : 'Save Changes')}
          </button>
        </form>
      );
    }
    
    if (activeTab.startsWith('collection_')) {
      const collectionDef = config.collections?.find(c => c.name === activeCollectionName);
      if (!collectionDef) return <div>Collection not found</div>;
      
      if (editingItem !== null) {
        return renderCollectionForm(collectionDef);
      }
      
      const items = collectionsData[activeCollectionName] || [];
      const titleField = collectionDef.fields[0]?.key || 'id'; // Use first field as title
      
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-semibold capitalize">{collectionDef.label || activeCollectionName}</h2>
            <button onClick={() => setEditingItem({})} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm" style={{ backgroundColor: config.accentColor }}>
              <Plus size={16} /> Add New
            </button>
          </div>
          
          {items.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Database className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>No items found. Click "Add New" to create one.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-gray-900 truncate">
                      {item[titleField] || 'Untitled Item'}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {Object.keys(item).filter(k => k !== 'id' && k !== titleField).map(k => String(item[k])).join(' • ').substring(0, 100)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setEditingItem(item)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteCollectionItem(item.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
              {leads.map((lead, idx) => {
                let leadData = {};
                try { leadData = JSON.parse(lead.data); } catch(e) {}
                
                return (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New Lead
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(lead.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                        {Object.entries(leadData).map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-sm font-medium text-gray-500 capitalize">{k.replace(/[_]/g, ' ')}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{String(v)}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Leads</h3>
          <p className="text-3xl font-bold">{leads.length}</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            All time
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Analytics</h3>
          <p className="text-3xl font-bold">Active</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            Data collecting...
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <Database size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Collections</h3>
          <p className="text-3xl font-bold">{config.collections?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            Dynamic data types
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
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
            <BarChart3 size={18} /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings size={18} /> Settings
          </button>
          
          {config.features?.inbox && (
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'inbox' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail size={18} /> Inbox
              </div>
              {leads.length > 0 && (
                <span className="bg-red-500 text-white text-xs py-0.5 px-2 rounded-full font-bold">
                  {leads.length}
                </span>
              )}
            </button>
          )}

          {config.collections && config.collections.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content</p>
              {config.collections.map(col => (
                <button 
                  key={col.name}
                  onClick={() => setActiveTab(`collection_${col.name}`)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeTab === `collection_${col.name}` ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Database size={16} /> {col.label || col.name}
                </button>
              ))}
            </div>
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={18} /> Exit Admin
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab.startsWith('collection_') 
              ? (config.collections?.find(c => c.name === activeTab.replace('collection_', ''))?.label || activeTab.replace('collection_', ''))
              : activeTab.replace('-', ' ')}
          </h2>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
