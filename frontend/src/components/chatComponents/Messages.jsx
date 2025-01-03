//messages.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';

import MessagesHeader from './MessagesHeader.jsx'; // Импортируем заголовок сообщений
import MessagesForm from './MessagesForm.jsx'; // Импортируем форму для отправки сообщений
import Message from './Message.jsx'; // Импортируем компонент для отображения отдельного сообщения

const Messages = ({ socket }) => {
  const { channels, currentChannelId } = useSelector((state) => state.channelsInfo);
  const messages = useSelector((state) => state.messagesInfo.messages);

  const activeChannel = channels.find(({ id }) => id === currentChannelId);
  const activeChannelMessages = messages.filter((message) => message.channelId === currentChannelId);

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader
          activeChannel={activeChannel}
          messagesCount={activeChannelMessages.length}
        />
        <div className="chat-messages overflow-auto px-5" id="messages-box">
          {activeChannelMessages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </div>
        <MessagesForm socket={socket} /> {/* Передаем сокет в MessagesForm */}
      </div>
    </Col>
  );
};

export default Messages;