import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'


// WeblyBadge - брендинг для Basic тарифа
function WeblyBadge() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a 
        href="https://t.me/weblyaibot?start=ref_342569882"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span className="text-sm font-medium text-gray-700">Made with <span className="text-blue-600 font-semibold">Webly AI</span></span>
      </a>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <App />
      <WeblyBadge />
    </>
  </React.StrictMode>,
)