import io from 'socket.io-client';

const socket = io(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/'
    : 'https://scrumsleek.herokuapp.com/',
  { transports: ['websocket'] }
);

export default socket;
