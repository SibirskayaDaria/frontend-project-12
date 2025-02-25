import React, { useState } from 'react';
import { useFetchDataQuery, useSendMessageMutation } from '../../slices/apiSlice.js';

const ChatPage = () => {
  const { data: messages, error, isLoading } = useFetchDataQuery();
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await sendMessage({ text: message }).unwrap();
      setMessage('');
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
    }
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки сообщений</p>;

  return (
    <div className="chat-container">
      <div className="messages">
        {messages?.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ChatPage;
