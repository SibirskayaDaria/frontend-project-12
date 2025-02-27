import React, { useState } from 'react';
import { useGetMessagesQuery, useSendMessageMutation } from '../../slices/apiSlice.js';

const ChatPage = () => {
  const { data: messages, error, isLoading } = useGetMessagesQuery(); 
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    console.log('Отправка сообщения:', { body: message, channelId: '1', username: 'admin' });
  
    try {
      await sendMessage({ body: message, channelId: '1', username: 'admin' }).unwrap();
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
            <strong>{msg.username}:</strong> {msg.body}
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
