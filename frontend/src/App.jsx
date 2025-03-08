import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ChatPage from './Components/pages/ChatPage.jsx';
import LoginPage from './Components/pages/LoginPage.jsx';
import SignUpPage from './Components/pages/SignUpPage.jsx';
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
        <Route path={routes.signUpPagePath()} element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
    <ToastContainer position="top-right" autoClose={3000} />
  </div>
);

export default App;
