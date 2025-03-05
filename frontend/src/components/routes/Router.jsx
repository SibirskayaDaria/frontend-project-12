import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatPage from '../pages/ChatPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import routes from '../../routes.js';

const RouterComponent = () => (
  <Routes>
    <Route
      path={routes.chatPagePath()}
      element={
        <PrivateRoute>
          <ChatPage />
        </PrivateRoute>
      }
    />
    <Route path={routes.loginPagePath()} element={<LoginPage />} />
    <Route path={routes.loginPagePath()} element={<LoginPage />} />
    <Route path={routes.signUpPagePath()} element={<SignUpPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default RouterComponent;
