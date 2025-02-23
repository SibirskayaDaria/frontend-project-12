import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../slices/messagesSlice.js';

const MessagesForm = ({ socket }) => {
  const dispatch = useDispatch();
  const [messageBody, setMessageBody] = useState('');
  const [error, setError] = useState('');
  const channelId = useSelector((state) => state.channelsInfo?.currentChannelId);
  const usernameFromRedux = useSelector((state) => state.auth?.username);
  const usernameFromStorage = localStorage.getItem('username');
  const [username, setUsername] = useState(usernameFromRedux || usernameFromStorage || 'Гость');

  useEffect(() => {
    setUsername(usernameFromRedux || usernameFromStorage || 'Гость');
  }, [usernameFromRedux]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      setError('Сообщение не может быть пустым.');
      return;
    }

    if (!socket?.connected) {
      setError('Ошибка: нет соединения с сервером.');
      return;
    }

    const newMessage = { body: messageBody, channelId, username };
    socket.emit('newMessage', newMessage, (response) => {
      if (response?.status === 'ok') {
        dispatch(addMessage(newMessage));
        setMessageBody('');
        setError('');
      } else {
        setError('Ошибка при отправке сообщения.');
      }
    });
  };

  return (
    <div className="chat-input-container mt-3 mb-3 ms-3 me-3">
      <Form onSubmit={handleSendMessage} className="d-flex w-100">
        <Form.Control
          type="text"
          placeholder="Введите сообщение..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          className="me-2 flex-grow-1"
        />
        <Button type="submit" className="btn-primary">
          Отправить
        </Button>
      </Form>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default MessagesForm;
