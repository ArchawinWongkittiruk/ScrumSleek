const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

// Init express app and socket.io server
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: '*' },
  transports: ['websocket'],
});
app.set('io', io);

// Connect database
(async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
})();

// Init middleware
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/sprints', require('./routes/sprints'));
app.use('/api/statuses', require('./routes/statuses'));
app.use('/api/members', require('./routes/members'));

// For getting active status of members of a given project
io.getActiveMembers = function (projectId) {
  const clients = io.sockets.adapter.rooms.get(projectId);
  const activeMembers = [];
  if (clients) {
    for (const clientId of clients) {
      activeMembers.push(io.sockets.sockets.get(clientId).userId);
    }
  }
  return activeMembers;
};

// For emitting active status of members of a given project
io.emitActiveMembers = function (projectId) {
  io.to(projectId).emit('SET_ACTIVE_MEMBERS', io.getActiveMembers(projectId));
};

// Socket event handlers
io.on('connection', (socket) => {
  socket.on('ENTER_PROJECT', async ({ userId, projectId }, callback) => {
    socket.userId = userId;
    socket.projectId = projectId;
    await socket.join(projectId);
    if (userId) {
      await io.emitActiveMembers(projectId);
      callback();
    } else {
      callback(io.getActiveMembers(projectId));
    }
  });

  socket.on('EXIT_PROJECT', async ({ userId, projectId }) => {
    await socket.leave(projectId);
    if (userId) io.emitActiveMembers(projectId);
  });

  socket.on('disconnect', async () => {
    await socket.leave(socket.projectId);
    if (socket.userId) io.emitActiveMembers(socket.projectId);
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('Server started on port ' + PORT));
