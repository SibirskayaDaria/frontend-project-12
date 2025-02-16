import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button, Modal, Form } from 'react-bootstrap';
import { actions } from '../../slices/index.js';

const Channels = () => {
  const { channels, currentChannelId, loading, error } = useSelector((s) => s.channelsInfo);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  useEffect(() => {
    const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    dispatch(actions.fetchData(authHeader));
  }, [dispatch]);

  const handleClick = (id) => {
    dispatch(actions.setCurrentChannel({ id }));
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewChannelName('');
  };

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      const newChannel = {
        id: Date.now(),
        name: newChannelName.trim(),
      };
      dispatch(actions.addChannel(newChannel));
      handleCloseModal();
    }
  };

  if (loading) {
    return <p className="text-center">Загрузка каналов...</p>;
  }

  if (error) {
    return <p className="text-danger text-center">Ошибка: {error}</p>;
  }

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between align-items-center mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <Button variant="light" className="p-0 border-0" onClick={handleShowModal} title="Добавить канал">
          <span className="fs-5">+</span>
        </Button>
      </div>

      <Nav as="ul" className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block" id="channels-box" activeKey={currentChannelId}>
        {channels.map((channel) => (
          <Nav.Item className="w-100" key={channel.id} as="li">
            <Button
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              className="w-100 rounded-0 text-start"
              onClick={() => handleClick(channel.id)}
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>
          </Nav.Item>
        ))}
      </Nav>

      {/* Модальное окно */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Создать канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Название канала</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите название"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleAddChannel}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Channels;

