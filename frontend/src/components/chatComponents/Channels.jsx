import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsPlusSquare } from 'react-icons/bs';
import { Nav, Button } from 'react-bootstrap';
import { actions } from '../../slices/index.js';

const Channels = () => {
  const { channels, currentChannelId } = useSelector((s) => s.channelsInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    // Проверяем, есть ли уже каналы в Redux, если их нет - добавляем
    if (channels.length === 0) {
      console.log('Добавляем каналы');
      dispatch(actions.addChannel({ id: 1, name: 'general' }));
      dispatch(actions.addChannel({ id: 2, name: 'random' }));
    }
  }, [channels.length, dispatch]); // Зависимость от length канала, чтобы сработало только при отсутствии каналов

  const handleClick = (id) => {
    dispatch(actions.setCurrentChannel({ id }));
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
      </div>
      <Nav
        as="ul"
        className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        id="channels-box"
        activeKey={currentChannelId}
      >
        {
          channels.map((channel) => (
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
          ))
        }
      </Nav>
    </div>
  );
};

export default Channels;
