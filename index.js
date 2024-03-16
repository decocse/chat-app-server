const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('set user', (userName) => {
    socket.userName = userName;
    io.emit('chat message', `${userName} joined the chat`);
  });

  socket.on('disconnect', () => {
    if (socket.userName) {
      io.emit('chat message', `${socket.userName} left the chat`);
    }
    console.log('Client disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('leave chat', (userName) => {
    io.emit('chat message', `${userName} left the chat`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
