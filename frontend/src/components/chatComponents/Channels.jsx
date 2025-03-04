import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { fetchData, fetchDataAddChannel, setCurrentChannel } from '../../slices/channelsSlice.js';
import { useDeleteChannelMutation, useRenameChannelMutation } from '../../slices/apiSlice.js';
import routes from '../../routes.js';

const Channels = () => {
  const { channels, currentChannelId } = useSelector((state) => state.channelsInfo);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelToRename, setChannelToRename] = useState(null);

  const [deleteChannel] = useDeleteChannelMutation();
  const [renameChannel] = useRenameChannelMutation();

  useEffect(() => {
    dispatch(fetchData({ Authorization: `Bearer ${localStorage.getItem('token')}` }));
  }, [dispatch]);

  const handleClick = (id) => dispatch(setCurrentChannel(id));

  const handleAddChannel = () => {
    if (!channelName.trim()) return;
    const token = localStorage.getItem('token');
    dispatch(fetchDataAddChannel({ body: { name: channelName }, token }))
      .unwrap()
      .then(() => {
        setChannelName('');
        setShowModal(false);
      })
      .catch(console.error);
  };

  const handleDeleteChannel = async (id) => {
    try {
      await deleteChannel(id).unwrap();
      dispatch(fetchData({ Authorization: `Bearer ${localStorage.getItem('token')}` }));
    } catch (error) {
      console.error('Ошибка удаления канала:', error);
    }
  };

  const handleRenameChannel = async () => {
    if (!channelToRename || !channelName.trim()) return;
    try {
      await renameChannel({ id: channelToRename.id, name: channelName }).unwrap();
      dispatch(fetchData({ Authorization: `Bearer ${localStorage.getItem('token')}` }));
      setShowRenameModal(false);
      setChannelName('');
    } catch (error) {
      console.error('Ошибка переименования канала:', error);
    }
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-3">
        <b>Каналы</b>
        <Button variant="light" onClick={() => setShowModal(true)}>+</Button>
      </div>
      <Nav className="flex-column px-2 overflow-auto h-100">
        {channels.map((channel) => (
          <Nav.Item key={channel.id} className="d-flex align-items-center">
            <Button
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              className="w-100 rounded-0 text-start"
              onClick={() => handleClick(channel.id)}
            >
              <span className="me-1">#</span>{channel.name}
            </Button>
            {channel.removable && (
              <Dropdown>
                <Dropdown.Toggle variant="light">⋮</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { setChannelToRename(channel); setChannelName(channel.name); setShowRenameModal(true); }}>Переименовать</Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={() => handleDeleteChannel(channel.id)}>Удалить</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav.Item>
        ))}
      </Nav>
      
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Создать канал</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Название канала</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите название"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleAddChannel}>Добавить</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Переименовать канал</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Новое название</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите новое название"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRenameModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleRenameChannel}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Channels;
