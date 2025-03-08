console.log('ChatPage is rendering');
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation } from '../../slices/apiSlice.js';
import Channels from "../chatComponents/Channels.jsx";
import { useTranslation } from 'react-i18next';

const getMessageCountText = (count, t) => {
  if (count % 10 === 1 && count % 100 !== 11) return t('messages.one', { count });
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return t('messages.few', { count });
  return t('messages.many', { count });
};

const ChatPage = () => {
  const { t } = useTranslation();
  const { data: messages = [], error, isLoading } = useGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState('');

  const channelId = useSelector((state) => state.channelsInfo?.currentChannelId);
  const channels = useSelector((state) => state.channelsInfo?.channels);
  const username = useSelector((state) => state.auth?.username) || localStorage.getItem('username') || t('guest');

  const currentChannel = channels.find((channel) => channel.id === channelId);
  const channelName = currentChannel ? currentChannel.name : t('unknown_chat');

  const filteredMessages = messages.filter((msg) => msg.channelId === channelId);
  const messageCountText = getMessageCountText(filteredMessages.length, t);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log(t('sending_message'), { body: message, channelId, username });

    try {
      await sendMessage({ body: message, channelId, username }).unwrap();
      setMessage('');
    } catch (err) {
      console.error(t('error_sending_message'), err);
    }
  };

  return (
    <div className="chat-wrapper container h-100 my-4 overflow-hidden rounded shadow">
      <Channels />

      <div className="chat-container">
        {isLoading && <p>{t('loading')}</p>}
        {error && <p className="text-danger">{t('error_loading_messages')}</p>}

        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {channelName}</b>
          </p>
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
              <p className="text-muted">{t('no_messages')}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            <div className="input-group">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('enter_message')}
                className="form-control"
              />
              <button type="submit" className="btn btn-primary">{t('send')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
