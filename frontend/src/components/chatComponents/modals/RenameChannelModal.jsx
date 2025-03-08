import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { fetchDataRenameChannel } from '../../../slices/channelsSlice';
import profanityFilter from '../../../profanityFilter.js';

const RenameChannelModal = ({ show, handleClose, channel }) => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (channel) {
      setNewName(channel.name);
    }
  }, [channel]);

  const handleRename = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = newName.trim();
    if (!trimmedName) {
      setError('Название канала не может быть пустым.');
      return;
    }
    
    if (profanityFilter.check(trimmedName)) {
      setError('Название содержит запрещённые слова.');
      return;
    }

    dispatch(fetchDataRenameChannel({ id: channel.id, name: trimmedName, token: localStorage.getItem('token') }));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleRename}>
          <Form.Group>
            <Form.Label>Новое название</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              isInvalid={!!error}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">Отмена</Button>
            <Button type="submit" variant="primary" disabled={!!error}>Сохранить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
