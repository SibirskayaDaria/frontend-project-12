import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { io } from 'socket.io-client';

import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';

import { actions } from '../slices/index.js';
import getAuthHeader from '../getAuthHeader.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const channelsInfo = useSelector((s) => s);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authHeader = await getAuthHeader();
      dispatch(actions.fetchData(authHeader))
        .unwrap()
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
    
    // Подключение к WebSocket
    const newSocket = io('http://localhost:5001'); // Убедитесь, что адрес соответствует вашему серверу
    setSocket(newSocket);

    // Обработчик для получения новых сообщений
    newSocket.on('newMessage', (message) => {
      dispatch(actions.addMessage(message)); // Добавляем новое сообщение в Redux
    });

    return () => {
      newSocket.disconnect(); // Отключение при размонтировании компонента
    };
  }, [dispatch]);

  if (channelsInfo.loading) {
    return (
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <h1>Loading...</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages socket={socket} /> {/* Передаем сокет в Messages */}
      </div>
    </Container>
  );
};

export default ChatPage;