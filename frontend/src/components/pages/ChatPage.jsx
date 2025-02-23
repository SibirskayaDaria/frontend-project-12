// Удаление WebSocket и добавление RTK Query

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import AuthProvider from './contexts/AuthProvider.jsx'; // ✅ Исправлен путь
import ChatPage from '../Components/pages/ChatPage.jsx'; // ✅ Исправлен путь
import LoginPage from '../Components/pages/LoginPage.jsx'; // ✅ Исправлен путь
import NotFoundPage from '../Components/pages/NotFoundPage.jsx'; // ✅ Исправлен путь
import AuthButton from '../Components/components/AuthButton.jsx'; // ✅ Исправлен путь
import PrivateRoute from '../Components/routes/PrivateRoute.jsx'; // ✅ Исправлен путь
import routes from '../routes.js'; // ✅ Исправлен путь
import { fetchData } from '../slices/apiSlice.js'; // ✅ Исправлен путь

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData()); // Загрузка данных при монтировании
  }, [dispatch]);

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
              <Navbar.Brand as={Link} to={routes.chatPagePath()}>Hexlet Chat</Navbar.Brand>
              <AuthButton />
            </Container>
          </Navbar>
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
            <Route path={routes.notFoundPagePath()} element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
