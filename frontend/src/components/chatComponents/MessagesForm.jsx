import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "../../slices/apiSlice.js";
import { filterText } from "../../profanityFilter"; // Подключаем фильтр

const MessagesForm = () => {
  const [messageBody, setMessageBody] = useState("");
  const [error, setError] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const channelId = useSelector((state) => state.channelsInfo?.currentChannelId);
  const username = useSelector((state) => state.auth?.username) || localStorage.getItem("username") || "Гость";

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      setError("Сообщение не может быть пустым.");
      return;
    }

    try {
      const filteredMessage = filterText(messageBody); // Фильтруем текст
      await sendMessage({ body: filteredMessage, channelId, username }).unwrap();
      setMessageBody("");
      setError("");
    } catch (err) {
      setError("Ошибка при отправке сообщения.");
      console.error("Ошибка:", err);
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
        <Button type="submit" className="btn-primary" disabled={!messageBody.trim()}>
          Отправить
        </Button>
      </Form>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default MessagesForm;
