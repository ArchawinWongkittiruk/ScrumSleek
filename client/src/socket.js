import io from 'socket.io-client';

const socket = io('https://scrumsleek.herokuapp.com/');

export default socket;
