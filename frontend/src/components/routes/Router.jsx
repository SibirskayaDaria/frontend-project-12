import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from '../pages/ChatPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Navbar from '../components/Navbar.jsx';
import routes from '../../routes.js'; // ✅ Добавлен импорт маршрутов

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route
        path={routes.chatPagePath()} // ✅ Теперь работает
        element={(
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        )}
      />
      <Route path={routes.loginPagePath()} element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
