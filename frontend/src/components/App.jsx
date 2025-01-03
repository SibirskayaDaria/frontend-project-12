//App.jsx
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

import { SocketContext, AuthContext } from '../contexts/index.jsx';
import { actions } from '../slices/index.js';
import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';
import "../styles.css"; 


const {
  addMessage,
  addChannel,
  setCurrentChannel,
  deleteChannel,
  channelRename,
} = actions;

// Функция для дебаунса
const useDebounce = (func, delay) => {
  const [timer, setTimer] = useState(null);

  return useCallback((...args) => {
    clearTimeout(timer);
    setTimer(setTimeout(() => func(...args), delay));
  }, [timer, func, delay]);
};

const AuthProvider = ({ children }) => {
  const savedUserData = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(Boolean(savedUserData));
  const [user, setUser] = useState(
    savedUserData ? { username: savedUserData.username } : null,
  );

  const logIn = useCallback((userData) => {
    setLoggedIn(true);
    setUser({ username: userData.username });
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    setUser(null);
    setLoggedIn(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      loggedIn,
      logIn,
      logOut,
      user,
    }),
    [loggedIn, logIn, logOut, user],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.loggedIn) {
    return <Navigate to={routes.loginPagePath()} state={{ from: location }} />;
  }

  return children;
};

const AuthButton = () => {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Выйти</Button>
      : null
  );
};

const App = () => {
  const dispatch = useDispatch();
  
  // Инициализация сокета в состоянии
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Создание нового сокета
    const newSocket = io({
      withCredentials: true 
    });

    // Обработчики сокета
    newSocket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });
    
    newSocket.on('newChannel', (payload) => {
      dispatch(addChannel(payload));
    });
    
    newSocket.on('removeChannel', (payload) => {
      dispatch(deleteChannel(payload.id));
    });
    
    newSocket.on('renameChannel', (payload) => {
      dispatch(channelRename(payload));
    });

    // Установка сокета
    setSocket(newSocket);

    // Очистка обработчиков и закрытие сокета при размонтировании компонента
    return () => {
      newSocket.off('newMessage');
      newSocket.off('newChannel');
      newSocket.off('removeChannel');
      newSocket.off('renameChannel');
      newSocket.close(); // Закрываем соединение
    };
    
  }, [dispatch]);

  // Дебаунс для отправки сообщений
  const sendMessage = useDebounce((...args) => {
    if (socket) { // Проверка на наличие сокета
      socket.emit('newMessage', ...args);
    }
  }, 300);

  const newChannel = useCallback((name, cb) => {
    if (socket) { // Проверка на наличие сокета
      socket.emit('newChannel', { name }, (response) => {
        const { status, data: { id } } = response;

        if (status === 'ok') {
          dispatch(setCurrentChannel({ id }));
          cb();
          return response.data;
        }
        return status;
      });
    }
  }, [dispatch, socket]);

  const removeChannel = useCallback((id) => {
    if (socket) { // Проверка на наличие сокета
      socket.emit('removeChannel', { id }, (response) => {
        const { status } = response;
        if (status === 'ok') {
          dispatch(deleteChannel({ id }));
        }
        return status;
      });
    }
  }, [dispatch, socket]);

  const renameChannel = useCallback(({ name, id }) => {
    if (socket) { // Проверка на наличие сокета
      socket.emit('renameChannel', { name, id });
    }
  }, [socket]);

  const socketApi = useMemo(
    () => ({
      sendMessage,
      newChannel,
      removeChannel,
      renameChannel,
    }),
    [sendMessage, newChannel, removeChannel, renameChannel],
  );

  return (
    <SocketContext.Provider value={socketApi}>
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
                element={(
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                )}
              />
              <Route path={routes.loginPagePath()} element={<LoginPage />} />
              <Route path={routes.notFoundPagePath()} element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </SocketContext.Provider>
  );
};

export default App;