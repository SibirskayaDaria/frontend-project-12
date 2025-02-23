import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import AuthProvider from './contexts/AuthProvider.jsx';
import SocketProvider from './contexts/SocketProvider.jsx';
import ChatPage from './Components/pages/ChatPage.jsx';
import LoginPage from './Components/pages/LoginPage.jsx';
import NotFoundPage from './Components/pages/NotFoundPage.jsx';
import AuthButton from './Components/components/AuthButton.jsx';
import PrivateRoute from './Components/routes/PrivateRoute.jsx';
import routes from './routes.js';

const App = () => (
  <SocketProvider>
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
  </SocketProvider>
);

export default App;
