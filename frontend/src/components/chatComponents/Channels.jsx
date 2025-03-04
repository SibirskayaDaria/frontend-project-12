import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { fetchData, fetchDataAddChannel, setCurrentChannel } from '../../slices/channelsSlice.js';
import { useDeleteChannelMutation, useRenameChannelMutation } from '../../slices/apiSlice.js';

const Channels = () => {
  const { channels, currentChannelId, loading, error } = useSelector((s) => s.channelsInfo);
  const dispatch = useDispatch();
  
  const [showModal, setShowModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [renameChannelName, setRenameChannelName] = useState('');
  const [channelToRename, setChannelToRename] = useState(null);
  
  const [deleteChannel] = useDeleteChannelMutation();
  const [renameChannel] = useRenameChannelMutation();

  useEffect(() => {
    const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    dispatch(fetchData(authHeader));
  }, [dispatch]);
  
  const handleClick = (id) => {
    dispatch(setCurrentChannel(id));
  };

  const handleAddChannel = () => {
    const token = localStorage.getItem('token');
    handleCloseModal();
    if (newChannelName.trim()) {
      dispatch(fetchDataAddChannel({ body: { name: newChannelName }, token }))
        .unwrap()
        .then(() => console.log("Канал успешно добавлен"))
        .catch((e) => console.log("Ошибка при добавлении канала:", e));
    }
  };

  const handleDeleteChannel = async (id) => {
    try {
      await deleteChannel(id);
      console.log(`Канал ${id} удален`);
    } catch (error) {
      console.error('Ошибка удаления канала:', error);
    }
  };

  const handleRenameChannel = async () => {
    if (!channelToRename || !renameChannelName.trim()) return;
    
    try {
      await renameChannel({ id: channelToRename.id, name: renameChannelName });
      console.log(`Канал ${channelToRename.id} переименован в ${renameChannelName}`);
      setShowRenameModal(false);
    } catch (error) {
      console.error('Ошибка переименования канала:', error);
    }
  };

  const handleShowRenameModal = (channel) => {
    setChannelToRename(channel);
    setRenameChannelName(channel.name);
    setShowRenameModal(true);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (loading) {
    return <p className="text-center">Загрузка каналов...</p>;
  }

  if (error) {
    console.log("Ошибка Redux:", error);
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
          <Nav.Item className="w-100 d-flex align-items-center" key={channel.id} as="li">
            <Button
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              className="w-100 rounded-0 text-start"
              onClick={() => handleClick(channel.id)}
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>

            {/* Меню для редактирования и удаления */}
            {channel.removable && (
              <Dropdown>
                <Dropdown.Toggle variant="light" className="p-0 border-0 ms-2">
                  ⋮
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleShowRenameModal(channel)}>Переименовать</Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={() => handleDeleteChannel(channel.id)}>Удалить</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav.Item>
        ))}
      </Nav>

      {/* Модальное окно для добавления канала */}
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
          <Button variant="secondary" onClick={handleCloseModal}>Отмена</Button>
          <Button variant="primary" onClick={handleAddChannel}>Добавить</Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно для переименования канала */}
      <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Новое название</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите новое название"
              value={renameChannelName}
              onChange={(e) => setRenameChannelName(e.target.value)}
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
