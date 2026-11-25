import React, { createContext, useContext, useState } from 'react';

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  // Demo toggle: default online. UI can toggle for demo.
  const [isOnline, setIsOnline] = useState(true);

  const toggleNetwork = () => setIsOnline((v) => !v);

  return (
    <NetworkContext.Provider value={{ isOnline, setIsOnline, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}