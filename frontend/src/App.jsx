import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import ChatPage from './Components/pages/ChatPage.jsx';
import LoginPage from './Components/pages/LoginPage.jsx';
import NotFoundPage from './Components/pages/NotFoundPage.jsx';
import AuthButton from './Components/components/AuthButton.jsx';
import PrivateRoute from './Components/routes/PrivateRoute.jsx';
import routes from './routes.js';

const App = () => (
  <div className="d-flex flex-column h-100">
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={routes.chatPagePath()}>Hexlet Chat</Navbar.Brand>
        <AuthButton />
      </Container>
    </Navbar>
    <div className="flex-grow-1">
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
        <Route path="*" element={<NotFoundPage />} /> {/* 404 обработка */}
      </Routes>
    </div>
  </div>
);

export default App;
