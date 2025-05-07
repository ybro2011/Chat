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
  room: string;
}

interface ChatMessage {
  user: string;
  text: string;
  time: string;
  room: string;
}

interface Room {
  id: string;
  users: User[];
}

const rooms: Map<string, Room> = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ username, roomCode }: { username: string; roomCode: string }) => {
    // Create room if it doesn't exist
    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, { id: roomCode, users: [] });
    }

    const room = rooms.get(roomCode)!;
    const user = { id: socket.id, username, room: roomCode };
    room.users.push(user);
    socket.join(roomCode);

    io.to(roomCode).emit('userJoined', { 
      message: `${username} has joined the chat`,
      time: new Date().toLocaleTimeString(),
      users: room.users.map(u => u.username)
    });
  });

  socket.on('message', (message: ChatMessage) => {
    const room = rooms.get(message.room);
    if (room) {
      const user = room.users.find(u => u.id === socket.id);
      if (user) {
        const chatMessage: ChatMessage = {
          user: user.username,
          text: message.text,
          time: new Date().toLocaleTimeString(),
          room: message.room
        };
        io.to(message.room).emit('message', chatMessage);
      }
    }
  });

  socket.on('disconnect', () => {
    // Find user in all rooms
    for (const [roomCode, room] of rooms.entries()) {
      const userIndex = room.users.findIndex(u => u.id === socket.id);
      if (userIndex !== -1) {
        const username = room.users[userIndex].username;
        room.users.splice(userIndex, 1);
        
        // Remove room if empty
        if (room.users.length === 0) {
          rooms.delete(roomCode);
        } else {
          io.to(roomCode).emit('userLeft', { 
            message: `${username} has left the chat`,
            time: new Date().toLocaleTimeString(),
            users: room.users.map(u => u.username)
          });
        }
        break;
      }
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