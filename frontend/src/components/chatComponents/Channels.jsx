import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { fetchData, fetchDataAddChannel, setCurrentChannel } from '../../slices/channelsSlice.js';
import { useDeleteChannelMutation, useRenameChannelMutation } from '../../slices/apiSlice.js';
import { useTranslation } from 'react-i18next';
import routes from '../../routes.js';

const Channels = () => {
  const { channels, currentChannelId, loading, error } = useSelector((s) => s.channelsInfo);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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

  const handleClick = (id) => dispatch(setCurrentChannel(id));

  const handleAddChannel = () => {
    if (!newChannelName.trim()) return;
    const token = localStorage.getItem('token');
    dispatch(fetchDataAddChannel({ body: { name: newChannelName }, token }))
      .unwrap()
      .then(() => {
        console.log('Канал успешно добавлен');
        setNewChannelName(''); // Очистка поля ввода после добавления
        setShowModal(false);
      })
      .catch((e) => console.error('Ошибка при добавлении канала:', e));
  };
  
  const handleCloseModal = () => {
    setNewChannelName(''); // Очистка поля при закрытии модального окна
    setShowModal(false);
  };
  

  const handleDeleteChannel = async (id) => {
    try {
      await deleteChannel(id).unwrap();
      dispatch(fetchData({ Authorization: `Bearer ${localStorage.getItem('token')}` }));
      console.log(`Канал ${id} удален`);
    } catch (error) {
      console.error('Ошибка удаления канала:', error);
    }
  };

  const handleRenameChannel = async () => {
    if (!channelToRename || !renameChannelName.trim()) {
      console.error("Ошибка: Не указан канал или новое имя!");
      return;
    }
  
    const { id } = channelToRename;
    const requestData = { name: renameChannelName }; // Убедись, что ключ "name" соответствует API
  
    console.log(`handleRenameChannel: отправка запроса PATCH на ${routes.channelPath(id)}`);
    
    try {
      await renameChannel({ id, ...requestData }).unwrap();
      dispatch(fetchData({ Authorization: `Bearer ${localStorage.getItem('token')}` }));
      setShowRenameModal(false);
      console.log(`Канал ${id} успешно переименован`);
    } catch (error) {
      console.error("Ошибка переименования канала:", error);
    }
  };
  

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between align-items-center mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.channels')}</b>
        <Button variant="light" className="p-0 border-0" onClick={() => setShowModal(true)}>
          <span className="fs-5">+</span>
        </Button>
      </div>
      <Nav as="ul" className="flex-column nav-pills px-2 mb-3 overflow-auto h-100">
        {channels.map((channel) => (
          <Nav.Item key={channel.id} className="w-100 d-flex align-items-center">
            <Button
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              className="w-100 rounded-0 text-start"
              onClick={() => handleClick(channel.id)}
            >
              <span className="me-1">#</span>{channel.name}
            </Button>
            {channel.removable && (
              <Dropdown>
                <Dropdown.Toggle variant="light" className="p-0 border-0 ms-2">⋮</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { setChannelToRename(channel); setRenameChannelName(channel.name); setShowRenameModal(true); }}>Переименовать</Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={() => handleDeleteChannel(channel.id)}>Удалить</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav.Item>
        ))}
      </Nav>

      {/* Модалка для добавления канала */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Создать канал</Modal.Title></Modal.Header>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleAddChannel}>Добавить</Button>
        </Modal.Footer>
      </Modal>

      {/* Модалка для переименования канала */}
      <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Переименовать канал</Modal.Title></Modal.Header>
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
