import React, { useState, useEffect } from 'react';
import { AdminConfig } from './config';
import { Settings, Users, BarChart3, Mail, Save, LogOut, KeyRound } from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetupState, setIsSetupState] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

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
    checkAuthSetup();
  }, []);

  const checkAuthSetup = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.isSetup) {
        setIsSetupState(false);
      } else {
        setIsSetupState(true);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isSetupState ? 'register' : 'login',
          username,
          password
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch(err) {
      setAuthError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = () => {
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
          setSettings(mergedSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
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
  
  if (authChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {isSetupState ? 'Настройка админ-панели' : 'Вход в админ-панель'}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {isSetupState ? 'Создайте учетные данные администратора для защиты сайта.' : 'Введите данные для входа в админ-панель.'}
          </p>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Логин</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              style={{ backgroundColor: config.accentColor }}
            >
              {loading ? 'Обработка...' : (isSetupState ? 'Создать админа' : 'Войти')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'settings') {
      return (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Блоки сайта и ссылки</h2>
            <div className="space-y-4">
              {config.editableFields?.map(field => (
                <div key={field.key} className="py-2 border-b border-gray-50 last:border-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'boolean' ? (
                    <label className="flex items-center cursor-pointer relative">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={!!settings[field.key]}
                        onChange={(e) => handleSettingChange(field.key, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" style={{ backgroundColor: settings[field.key] ? config.accentColor : '' }}></div>
                      <span className="ml-3 text-sm font-medium text-gray-600">
                        {settings[field.key] ? 'Видимый' : 'Скрытый'}
                      </span>
                    </label>
                  ) : (
                    <input 
                      type="text" 
                      value={settings[field.key] || ''}
                      onChange={(e) => handleSettingChange(field.key, e.target.value)}
                      placeholder="https://... or #section-id"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>
              ))}
              
              {(!config.editableFields || config.editableFields.length === 0) && (
                <div className="text-gray-500 text-sm italic">Настройки не определены в config.js</div>
              )}
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-md" style={{ backgroundColor: config.accentColor }}>
            <Save size={18} /> {loading ? 'Сохранение...' : (saved ? 'Сохранено!' : 'Сохранить изменения')}
          </button>
        </form>
      );
    }
    
    if (activeTab === 'inbox' && config.features?.inbox) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Заявки и обращения</h2>
          </div>
          {leads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>Заявок пока нет. Когда пользователи отправят формы, они появятся здесь.</p>
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
                        Новая заявка
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Всего заявок</h3>
          <p className="text-3xl font-bold">{leads.length}</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            За все время
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Аналитика</h3>
          <p className="text-3xl font-bold">Активна</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            Сбор данных...
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
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Админ-панель</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={18} /> Главная
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings size={18} /> Настройки
          </button>
          
          {config.features?.inbox && (
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'inbox' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail size={18} /> Заявки
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
          <button onClick={() => {
            // Very simple logout simulation for MVP
            window.location.reload();
          }} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={18} /> Выход
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
