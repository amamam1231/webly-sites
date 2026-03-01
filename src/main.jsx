import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminApp from './admin/AdminApp';
import App from './App.jsx'
import './index.css'


const path = window.location.pathname;
const RootComponent = path.startsWith('/admin') ? <AdminApp /> : {RootComponent};
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {RootComponent}
  </React.StrictMode>,
)