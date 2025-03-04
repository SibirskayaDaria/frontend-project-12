import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { fetchDataRenameChannel } from '../../../slices/channelsSlice';

const RenameChannelModal = ({ show, handleClose, channel }) => {
  const [newName, setNewName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (channel) {
      setNewName(channel.name);
    }
  }, [channel]);

  const handleRename = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    dispatch(fetchDataRenameChannel({ id: channel.id, name: newName, token: localStorage.getItem('token') }));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleRename}>
          <Form.Group>
            <Form.Label>Новое название</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">Отмена</Button>
            <Button type="submit" variant="primary">Сохранить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;