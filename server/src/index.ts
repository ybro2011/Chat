import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors({
  origin: '*',
  credentials: true
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  allowEIO3: true
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

interface Message {
  user: string;
  text: string;
  time: string;
}

interface Room {
  users: Set<string>;
  messages: Message[];
}

interface ActiveRoom {
  name: string;
  userCount: number;
}

// Track active rooms
const activeRooms: Map<string, Room> = new Map();

// Function to broadcast active rooms to all clients
const broadcastActiveRooms = () => {
  const rooms: ActiveRoom[] = Array.from(activeRooms.entries()).map(([name, room]) => ({
    name,
    userCount: room.users.size
  }));
  io.emit('activeRooms', rooms);
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle getActiveRooms request
  socket.on('getActiveRooms', () => {
    const rooms: ActiveRoom[] = Array.from(activeRooms.entries()).map(([name, room]) => ({
      name,
      userCount: room.users.size
    }));
    socket.emit('activeRooms', rooms);
  });

  socket.on('join', ({ username, roomCode }: { username: string; roomCode: string }) => {
    console.log(`Join request - Room: ${roomCode}, User: ${username}`);

    // Create room if it doesn't exist
    if (!activeRooms.has(roomCode)) {
      activeRooms.set(roomCode, { users: new Set(), messages: [] });
    }

    const room = activeRooms.get(roomCode)!;
    room.users.add(username);
    socket.join(roomCode);
    socket.data.username = username;
    socket.data.room = roomCode;

    // Broadcast updated active rooms
    broadcastActiveRooms();

    if (roomCode === 'main') {
      // Send list of active rooms to admin
      const adminRooms: ActiveRoom[] = Array.from(activeRooms.entries()).map(([name, room]) => ({
        name,
        userCount: room.users.size
      }));
      socket.emit('adminRooms', adminRooms);
    }

    // Notify room members
    io.to(roomCode).emit('userJoined', { 
      message: `${username} has joined the chat`,
      time: new Date().toLocaleTimeString(),
      users: Array.from(room.users)
    });

    // Notify admin if connected
    broadcastActiveRooms();
  });

  socket.on('message', (message: ChatMessage) => {
    const room = activeRooms.get(message.room);
    if (room) {
      const user = Array.from(room.users).find(u => u === message.user);
      if (user) {
        const chatMessage: ChatMessage = {
          user: message.user,
          text: message.text,
          time: new Date().toLocaleTimeString(),
          room: message.room
        };
        io.to(message.room).emit('message', chatMessage);
      }
    }
  });

  socket.on('kickUser', ({ roomCode, username }: { roomCode: string; username: string }) => {
    const room = activeRooms.get(roomCode);
    if (room) {
      if (room.users.has(username)) {
        // Notify the user they've been kicked
        io.to(roomCode).emit('kicked', { message: 'You have been kicked from the room' });
        // Remove user from room
        room.users.delete(username);
        // Notify remaining users
        io.to(roomCode).emit('userLeft', {
          message: `${username} has been kicked from the chat`,
          time: new Date().toLocaleTimeString(),
          users: Array.from(room.users)
        });
        // Remove room if empty
        if (room.users.size === 0) {
          activeRooms.delete(roomCode);
        }
        // Notify admin
        broadcastActiveRooms();
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const username = socket.data.username;
    const room = socket.data.room;

    if (username && room && activeRooms.has(room)) {
      const roomData = activeRooms.get(room)!;
      roomData.users.delete(username);
      
      // Remove room if empty
      if (roomData.users.size === 0) {
        activeRooms.delete(room);
      } else {
        io.to(room).emit('userLeft', { 
          message: `${username} has left the chat`,
          time: new Date().toLocaleTimeString(),
          users: Array.from(roomData.users)
        });
      }
      
      // Broadcast updated active rooms
      broadcastActiveRooms();
      
      // Notify admin if connected
      io.emit('roomUpdate', {
        rooms: Array.from(activeRooms.entries()).map(([id, room]) => ({
          id,
          userCount: room.users.size,
          users: Array.from(room.users)
        }))
      });
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