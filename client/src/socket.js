import io from 'socket.io-client';
import store from './store';

const socket = io(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/'
    : 'https://scrumsleek.herokuapp.com/'
);

const getUserId = () => store.getState().auth.user?._id;

let currentUserId = getUserId();

const setUserId = () => {
  socket.emit('SET_USER_ID', currentUserId);
};

store.subscribe(() => {
  let previousUserId = currentUserId;
  currentUserId = getUserId();

  if (previousUserId !== currentUserId) setUserId();
});

socket.on('connect', () => {
  setUserId();
});

export default socket;
