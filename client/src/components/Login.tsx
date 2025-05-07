import { useState } from 'react';
import { Socket } from 'socket.io-client';

interface LoginProps {
  onLogin: (username: string, roomCode: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomCode.trim()) {
      onLogin(username.trim(), roomCode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-[#0a0a0a] p-8 rounded-lg border border-[#00ff00] w-96">
        <h2 className="text-[#00ff00] text-2xl mb-6 text-center">&gt; Join Chat Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomCode" className="block text-[#00ff00] mb-2">
              &gt; Room Code
            </label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full bg-black text-[#00ff00] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ff00] border border-[#00ff00]"
              placeholder="Enter room code..."
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-[#00ff00] mb-2">
              &gt; Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black text-[#00ff00] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ff00] border border-[#00ff00]"
              placeholder="Enter your username..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#003300] text-[#00ff00] px-6 py-2 rounded-lg hover:bg-[#004400] focus:outline-none focus:ring-2 focus:ring-[#00ff00] border border-[#00ff00]"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 