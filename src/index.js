import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // CSS for hele appen
import App from './App'; // Vår hovedkomponent

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);