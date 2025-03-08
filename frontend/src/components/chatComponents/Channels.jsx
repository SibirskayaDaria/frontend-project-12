import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { fetchData, fetchDataAddChannel, setCurrentChannel } from '../../slices/channelsSlice.js';
import { useDeleteChannelMutation, useRenameChannelMutation } from '../../slices/apiSlice.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from '../../routes.js';
import filterProfanity from '../../profanityFilter.js';


const Channels = () => {
  const { channels, currentChannelId } = useSelector((s) => s.channelsInfo);
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

    const filteredName = filterProfanity(newChannelName);
    if (!filteredName) {
      toast.error(t('channels.prohibitedName'));
      return;
    }

    const token = localStorage.getItem('token');
    dispatch(fetchDataAddChannel({ body: { name: filteredName }, token }))
      .unwrap()
      .then(() => {
        toast.success(t('channels.addSuccess'));
        setNewChannelName('');
        setShowModal(false);
      })
      .catch(() => {
        toast.error(t('channels.addError'));
      });
  };

  const handleCloseModal = () => {
    setNewChannelName('');
    setShowModal(false);
  };

  const handleDeleteChannel = async (id) => {
    try {
      await deleteChannel(id).unwrap();
      dispatch(fetchData({ Authorization: `Bearer ${localStorage.getItem('token')}` }));
      toast.success(t('channels.deleteSuccess', { id }));
    } catch (error) {
      toast.error(t('channels.deleteError'));
    }
  };

  const handleRenameChannel = async () => {
    if (!channelToRename || !renameChannelName.trim()) {
      toast.error(t('channels.renameError'));
      return;
    }

    const filteredName = filterProfanity(renameChannelName);
    if (!filteredName) {
      toast.error(t('channels.prohibitedName'));
      return;
    }

    const { id } = channelToRename;
    const requestData = { name: filteredName };

    try {
      await renameChannel({ id, ...requestData }).unwrap();
      dispatch(fetchData({ Authorization: `Bearer ${localStorage.getItem('token')}` }));
      setShowRenameModal(false);
      toast.success(t('channels.renameSuccess', { id }));
    } catch (error) {
      toast.error(t('channels.renameError'));
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

      <Modal show={showModal} onHide={handleCloseModal} centered>
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
          <Button variant="secondary" onClick={handleCloseModal}>Отмена</Button>
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
