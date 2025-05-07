import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

interface User {
  id: string;
  username: string;
}

const users: User[] = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username: string) => {
    const user = { id: socket.id, username };
    users.push(user);
    io.emit('userJoined', { users, message: `${username} has joined the chat` });
  });

  socket.on('message', (message: string) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      io.emit('message', {
        user: user.username,
        text: message,
        time: new Date().toLocaleTimeString()
      });
    }
  });

  socket.on('disconnect', () => {
    const userIndex = users.findIndex(u => u.id === socket.id);
    if (userIndex !== -1) {
      const username = users[userIndex].username;
      users.splice(userIndex, 1);
      io.emit('userLeft', { users, message: `${username} has left the chat` });
    }
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 