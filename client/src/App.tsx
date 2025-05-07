import { useState } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';
import AdminView from './components/AdminView';

const socket = io(import.meta.env.PROD ? window.location.origin : 'http://localhost:3000');

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (username: string, roomCode: string) => {
    setUser(username);
    if (roomCode === 'super_safe1') {
      setIsAdmin(true);
    } else {
      setRoom(roomCode);
    }
  };

  const handleJoinRoom = (roomCode: string) => {
    setRoom(roomCode);
    setIsAdmin(false);
  };

  return (
    <div className="h-screen bg-black">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : isAdmin ? (
        <AdminView socket={socket} onJoinRoom={handleJoinRoom} />
      ) : (
        <Chat user={user} room={room!} socket={socket} />
      )}
    </div>
  );
}

export default App; 