import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Chat from './components/Chat';
import Login from './components/Login';

const socket = io(import.meta.env.PROD ? window.location.origin : 'http://localhost:3000');

function App() {
  const [username, setUsername] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    socket.emit('join', name);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Chat socket={socket} username={username} />
        )}
      </div>
    </div>
  );
}

export default App; 