import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('eduai_token');
    const u = localStorage.getItem('eduai_user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);

  const loginUser = (tok, usr) => {
    setToken(tok); setUser(usr);
    localStorage.setItem('eduai_token', tok);
    localStorage.setItem('eduai_user', JSON.stringify(usr));
  };

  const logoutUser = () => {
    setToken(null); setUser(null); setCurrentTest(null);
    localStorage.removeItem('eduai_token');
    localStorage.removeItem('eduai_user');
  };

  return (
    <AppContext.Provider value={{
      user, token, currentTest, sidebarOpen,
      loginUser, logoutUser, setCurrentTest,
      setSidebarOpen: () => setSidebarOpen(p => !p)
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);