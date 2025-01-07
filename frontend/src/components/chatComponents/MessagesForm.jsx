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
      {error && <div className="text-danger mt-2">{error}</div>} {/* Отображение ошибки */}
    </div>
  );
};

export default MessagesForm;
