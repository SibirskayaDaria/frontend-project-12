import React, { useEffect, useState, useMemo, useCallback, createContext } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { actions as channelsActions } from '../slices/index.js';

export const SocketContext = createContext(null);

const { addMessage, addChannel, setCurrentChannel, deleteChannel, channelRename } = channelsActions;

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io({ withCredentials: true });
    newSocket.on('newMessage', (payload) => dispatch(addMessage(payload)));
    newSocket.on('newChannel', (payload) => {
        console.log('newChannel received:', payload);
        dispatch(addChannel(payload));
      });      
    newSocket.on('removeChannel', ({ id }) => dispatch(deleteChannel({ id })));
    newSocket.on('renameChannel', (payload) => dispatch(channelRename(payload)));
    setSocket(newSocket);

    return () => {
      newSocket.off('newMessage');
      newSocket.off('newChannel');
      newSocket.off('removeChannel');
      newSocket.off('renameChannel');
      newSocket.close();
    };
  }, [dispatch]);

  const sendMessage = useCallback((...args) => {
    if (socket) socket.emit('newMessage', ...args);
  }, [socket]);

  const newChannel = useCallback((name, cb) => {
    if (socket) {
      socket.emit('newChannel', { name }, (response) => {
        if (response.status === 'ok') {
          dispatch(setCurrentChannel({ id: response.data.id }));
          cb();
        }
      });
    }
  }, [dispatch, socket]);

  const removeChannel = useCallback((id) => {
    if (socket) socket.emit('removeChannel', { id });
  }, [socket]);

  const renameChannel = useCallback(({ name, id }) => {
    if (socket) socket.emit('renameChannel', { name, id });
  }, [socket]);

  const socketApi = useMemo(() => ({ sendMessage, newChannel, removeChannel, renameChannel }),
    [sendMessage, newChannel, removeChannel, renameChannel]);

  return <SocketContext.Provider value={socketApi}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
