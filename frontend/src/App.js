import React from 'react';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <h1>AI ATS Job Matcher (Frontend)</h1>
      </div>
    </AuthProvider>
  );
}

export default App;
