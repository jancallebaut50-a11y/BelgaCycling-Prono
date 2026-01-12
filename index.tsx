
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './hooks/useMockData';

// Global error handler to help catch deployment crashes
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Catch:", message, "at", source, ":", lineno);
  const rootEl = document.getElementById('root');
  if (rootEl && rootEl.innerHTML === "") {
    rootEl.innerHTML = `<div style="padding: 20px; color: white; background: #991b1b; font-family: sans-serif;">
      <h1 style="font-size: 20px;">App Initialization Error</h1>
      <p style="font-size: 14px;">${message}</p>
      <p style="font-size: 12px; opacity: 0.8;">Check the browser console (F12) for more details.</p>
    </div>`;
  }
};

console.log("BelgaCycling: Initializing mount...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("FATAL: Could not find root element with ID 'root'");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <DataProvider>
        <App />
      </DataProvider>
    </React.StrictMode>
  );
  console.log("BelgaCycling: Render initiated successfully.");
} catch (err) {
  console.error("FATAL: Render failed", err);
}
