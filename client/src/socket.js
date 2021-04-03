import io from 'socket.io-client';
import store from './store';

const socket = io(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/'
    : 'https://scrumsleek.herokuapp.com/'
);

const getUserId = () => store.getState().auth.user?._id;

let currentUserId = getUserId();

const setSocketUserId = () => {
  socket.emit('SET_USER_ID', currentUserId);
};

store.subscribe(() => {
  let previousUserId = currentUserId;
  currentUserId = getUserId();

  if (previousUserId !== currentUserId) setSocketUserId();
});

socket.on('connect', () => {
  setSocketUserId();
});

socket.onAny((type, payload) => {
  store.dispatch({ type, payload });
});

export default socket;
