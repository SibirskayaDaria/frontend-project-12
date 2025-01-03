//message.jsx
import React from 'react';

const Message = ({ message }) => {
  const { id, username, text } = message;

  return (
    <div className="text-break mb-2" key={id}>
      <strong>{username}</strong>: {text}
    </div>
  );
};

export default Message;