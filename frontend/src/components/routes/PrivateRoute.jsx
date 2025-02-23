import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks'; // Исправленный путь
import routes from '../../routes'; // Исправленный путь

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? children : <Navigate to={routes.loginPagePath()} state={{ from: location }} />;
};

export default PrivateRoute;
