import { useState } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';

const socket = io(import.meta.env.PROD ? window.location.origin : 'http://localhost:3000');

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);

  const handleLogin = (username: string, roomCode: string) => {
    setUser(username);
    setRoom(roomCode);
  };

  return (
    <div className="h-screen bg-black">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat user={user} room={room!} socket={socket} />
      )}
    </div>
  );
}

export default App; 