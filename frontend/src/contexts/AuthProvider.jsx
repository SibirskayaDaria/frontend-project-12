// contexts/AuthProvider.jsx
import React, { useMemo, useState, useCallback, useEffect, createContext } from 'react';

export const AuthContext = createContext(null); // ✅ Теперь он создаётся прямо здесь

const AuthProvider = ({ children }) => {
  const savedUserData = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(!!savedUserData?.username);
  const [user, setUser] = useState(savedUserData || null);

  useEffect(() => {
    console.log("Проверка авторизации:", loggedIn);
  }, [loggedIn]);

  const logIn = useCallback((userData) => {
    localStorage.setItem('userId', JSON.stringify(userData));
    setLoggedIn(true);
    setUser(userData);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setUser(null);
  }, []);

  const memoizedValue = useMemo(() => ({
    loggedIn,
    logIn,
    logOut,
    user,
  }), [loggedIn, logIn, logOut, user]);

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
