import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Row } from 'react-bootstrap';
import Channels from '../chatComponents/Channels.jsx';
import Messages from '../chatComponents/Messages.jsx';
import { actions } from '../../slices/index.js';
import getAuthHeader from '../../getAuthHeader.js';
import { SocketContext } from '../../contexts/SocketProvider.jsx'; 

const ChatPage = () => {
  const dispatch = useDispatch();
  const channelsInfo = useSelector((state) => state);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authHeader = await getAuthHeader();
        await dispatch(actions.fetchData(authHeader)).unwrap();
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();

    if (socket) {
      const handleNewMessage = (message) => dispatch(actions.addMessage(message));

      console.log('Сокет подключен:', socket);
      socket.on?.('newMessage', handleNewMessage);

      return () => {
        socket.off?.('newMessage', handleNewMessage);
      };
    }
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
        <Messages socket={socket} />
      </div>
    </Container>
  );
};

export default ChatPage;
