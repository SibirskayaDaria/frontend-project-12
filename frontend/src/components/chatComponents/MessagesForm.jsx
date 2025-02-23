import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../slices/messagesSlice.js';

const MessagesForm = ({ socket }) => {
  const dispatch = useDispatch();
  const [messageBody, setMessageBody] = useState('');
  const [error, setError] = useState('');

  const state = useSelector((state) => state);
  console.log('Redux state:', state);

  const channelId = state.channelsInfo?.currentChannelId;
  console.log('Current channelId:', channelId);

  const usernameFromRedux = useSelector((state) => state.auth?.username);
  const usernameFromStorage = localStorage.getItem('username');
  const username = usernameFromRedux || usernameFromStorage || 'Гость';

  console.log('Username from Redux:', usernameFromRedux);
  console.log('Username from LocalStorage:', usernameFromStorage);
  console.log('Final Username:', username);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      setError('Сообщение не может быть пустым.');
      console.log('Ошибка: пустое сообщение');
      return;
    }

    if (!username) {
      setError('Ошибка: пользователь не определён.');
      console.log('Ошибка: отсутствует username');
      return;
    }

    const newMessage = { body: messageBody, channelId, username };

    console.log('Отправляем сообщение:', newMessage);

    try {
      socket.emit('newMessage', newMessage, (response) => {
        console.log('Ответ сервера:', response);
        if (response.status === 'ok') {
          dispatch(addMessage(newMessage));
          setMessageBody('');
          setError('');
        } else {
          setError('Ошибка при отправке сообщения.');
          console.log('Ошибка при отправке:', response);
        }
      });
    } catch (err) {
      setError('Ошибка при отправке сообщения. Попробуйте еще раз.');
      console.log('Ошибка при выполнении запроса:', err);
    }
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
