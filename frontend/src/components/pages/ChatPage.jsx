console.log('ChatPage рендерится');
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation } from '../../slices/apiSlice.js';
import Channels from "../chatComponents/Channels.jsx";

const ChatPage = () => {
  const { data: messages, error, isLoading } = useGetMessagesQuery(); 
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState('');

  const channelId = useSelector((state) => state.channelsInfo?.currentChannelId);
  const username = useSelector((state) => state.auth?.username) || localStorage.getItem('username') || 'Гость';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log('Отправка сообщения:', { body: message, channelId, username });

    try {
      await sendMessage({ body: message, channelId, username }).unwrap();
      setMessage('');
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
    }
  };  

  return (
    <div className="chat-wrapper">
      <Channels />

      <div className="chat-container">
        {isLoading && <p>Загрузка...</p>}
        {error && <p className="text-danger">Ошибка загрузки сообщений</p>}

        <div className="messages-container">
          <div className="messages">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="message">
                  <strong>{msg.username}:</strong> {msg.body}
                </div>
              ))
            ) : (
              <p className="text-muted">Сообщений пока нет</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            <div className="input-group">
               <input
               type="text"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Введите сообщение..."
               className="form-control"
               />
               <button type="submit" className="btn btn-primary">Отправить</button>
               </div>
               </form>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;
