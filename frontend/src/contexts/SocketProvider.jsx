import React, { useEffect, useState, useMemo, useCallback, createContext } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import * as channelsActions from '../slices/channelsSlice.js';


export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io({ withCredentials: true });

    newSocket.on('connect', () => {
      console.log(`🔌 WebSocket подключен! ID: ${newSocket.id}`);
    });
    
    newSocket.onAny((event, ...args) => {
      console.log(`📡 Получено событие: ${event}`, args);
    });

    newSocket.on('disconnect', (reason) => {
      console.log(`❌ WebSocket отключен: ${reason}`);
    });

    newSocket.on('newMessage', (payload) => {
      console.log('📩 Получено сообщение:', payload);
      dispatch(channelsActions.addMessage(payload));
    });

    newSocket.on('newChannel', (payload) => {
      console.log('📢 Новый канал:', payload);
      dispatch(channelsActions.addChannel(payload));
    });

    newSocket.on('removeChannel', ({ id }) => {
      console.log(`🗑 Канал удалён: ID ${id}`);
      dispatch(channelsActions.deleteChannel({ id }));
    });

    newSocket.on('renameChannel', (payload) => {
      console.log('✏ Канал переименован:', payload);
      dispatch(channelsActions.channelRename(payload));
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Закрытие WebSocket соединения');
      newSocket.offAny();
      newSocket.close();
    };
  }, [dispatch]);

  const sendMessage = useCallback((...args) => {
    if (socket) {
      console.log('📤 Отправка сообщения:', args);
      socket.emit('newMessage', ...args);
    } else {
      console.warn('⚠ Ошибка: WebSocket не подключен.');
    }
  }, [socket]);

  const newChannel = useCallback((name, cb) => {
    if (socket) {
      console.log(`📤 Создание нового канала: ${name}`);
      socket.emit('newChannel', { name }, (response) => {
        console.log('Ответ на создание канала:', response);
        if (response?.status === 'ok') {
          dispatch(channelsActions.setCurrentChannel({ id: response.data.id }));
          cb();
        } else {
          console.warn('⚠ Ошибка при создании канала:', response);
        }
      });
    } else {
      console.warn('⚠ Ошибка: WebSocket не подключен.');
    }
  }, [dispatch, socket]);

  const removeChannel = useCallback((id) => {
    if (socket) {
      console.log(`🗑 Запрос на удаление канала ID: ${id}`);
      socket.emit('removeChannel', { id });
    } else {
      console.warn('⚠ Ошибка: WebSocket не подключен.');
    }
  }, [socket]);

  const renameChannel = useCallback(({ name, id }) => {
    if (socket) {
      console.log(`✏ Запрос на переименование канала ID: ${id} -> ${name}`);
      socket.emit('renameChannel', { name, id });
    } else {
      console.warn('⚠ Ошибка: WebSocket не подключен.');
    }
  }, [socket]);

  const socketApi = useMemo(
    () => ({ sendMessage, newChannel, removeChannel, renameChannel }),
    [sendMessage, newChannel, removeChannel, renameChannel]
  );

  return <SocketContext.Provider value={socketApi}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
