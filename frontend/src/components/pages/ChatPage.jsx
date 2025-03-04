console.log('ChatPage рендерится');
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation } from '../../slices/apiSlice.js';
import Channels from "../chatComponents/Channels.jsx";

// Функция для правильного склонения слова "сообщение"
const getMessageCountText = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return `${count} сообщение`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} сообщения`;
  return `${count} сообщений`;
};

const ChatPage = () => {
  const { data: messages = [], error, isLoading } = useGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState('');

  const channelId = useSelector((state) => state.channelsInfo?.currentChannelId);
  const channels = useSelector((state) => state.channelsInfo?.channels);
  const username = useSelector((state) => state.auth?.username) || localStorage.getItem('username') || 'Гость';

  // Получаем имя текущего чата
  const currentChannel = channels.find((channel) => channel.id === channelId);
  const channelName = currentChannel ? currentChannel.name : 'Неизвестный чат';

  // Фильтруем сообщения по текущему чату
  const filteredMessages = messages.filter((msg) => msg.channelId === channelId);
  const messageCountText = getMessageCountText(filteredMessages.length);

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
    <div className="chat-wrapper container h-100 my-4 overflow-hidden rounded shadow">
      <Channels />

      <div className="chat-container">
        {isLoading && <p>Загрузка...</p>}
        {error && <p className="text-danger">Ошибка загрузки сообщений</p>}

        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            {/* Динамически передаём имя текущего чата */}
            <b># {channelName}</b>
          </p>
          {/* Динамически передаём количество сообщений с правильным склонением */}
          <span className="text-muted">{messageCountText}</span>
        </div>

        <div className="messages-container">
          <div className="messages">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
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
