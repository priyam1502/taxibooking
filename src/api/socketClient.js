import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false, transports: ['websocket'] });
  }
  return socket;
};

export const connectSocket = ({ role, id }) => {
  const s = getSocket();
  if (!s.connected) s.connect();
  s.emit('join', { role, id });
  return s;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
