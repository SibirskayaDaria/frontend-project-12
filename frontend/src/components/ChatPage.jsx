import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Row } from 'react-bootstrap';
import Channels from './chatComponents/Channels.jsx';
import Messages from './chatComponents/Messages.jsx';
import { actions } from '../slices/index.js';
import getAuthHeader from '../getAuthHeader.js'; // Правильный импорт функции
import { SocketContext } from '../main.jsx';

const ChatPage = () => {
  const dispatch = useDispatch();
  const channelsInfo = useSelector((s) => s);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchData = async () => {
      const authHeader = await getAuthHeader(); // Получаем авторизационный заголовок
      dispatch(actions.fetchData(authHeader))
        .unwrap()
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();

    socket.on('newMessage', (message) => {
      dispatch(actions.addMessage(message)); // добавляем сообщение в Redux
    });

    return () => {
      socket.off('newMessage');
    };
  }, [dispatch, socket]);

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
