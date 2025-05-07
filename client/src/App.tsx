import { useState } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';

const socket = io(import.meta.env.PROD ? window.location.origin : 'http://localhost:3000');

function App() {
  const [user, setUser] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-green-500">
      {!user ? <Login onLogin={setUser} /> : <Chat user={user} socket={socket} />}
    </div>
  );
}

export default App; 