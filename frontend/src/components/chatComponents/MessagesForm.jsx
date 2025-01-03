//MessagesForm.jsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../slices/messagesSlice.js'; // Импортируем действие для добавления сообщения

const MessagesForm = ({ socket }) => {
  const dispatch = useDispatch();
  const [messageBody, setMessageBody] = useState('');
  const [error, setError] = useState(''); // Состояние для хранения ошибок

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageBody.trim()) {
      try {
        // Отправка сообщения на сервер через WebSocket
        socket.emit('message', { body: messageBody });

        // Добавляем сообщение в локальное состояние Redux
        dispatch(addMessage({ body: messageBody }));

        // Очистка поля ввода и сброс ошибки
        setMessageBody('');
        setError('');
      } catch (err) {
        setError('Ошибка при отправке сообщения. Попробуйте еще раз.'); // Установка ошибки
      }
    } else {
      setError('Сообщение не может быть пустым.'); // Проверка на пустое сообщение
    }
  };

  return (
    <Form onSubmit={handleSendMessage}>
      <Form.Group className="input-group">
        <Form.Control
          type="text"
          placeholder="Введите сообщение..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
        />
        <Button type="submit">Отправить</Button>
      </Form.Group>
      {error && <div className="text-danger">{error}</div>} {/* Отображение ошибки */}
    </Form>
  );
};

export default MessagesForm;