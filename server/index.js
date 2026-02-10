const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Single shared room for MVP
const CHAT_ROOM = 'shared-room';

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.join(CHAT_ROOM);

  socket.on('send_message', (data) => {
    // Relay message to all clients in the room
    // DATA should contain: id, sender, text, timestamp
    // Server does NOT store or log the content
    io.to(CHAT_ROOM).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
