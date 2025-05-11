import { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, roomCode: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim(), roomCode.trim() || 'main');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border-2 border-[#4a90e2]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">GCSE Biology</h1>
          <h2 className="text-xl text-[#4a90e2]">Study Group Chat</h2>
          <div className="w-24 h-1 bg-[#4a90e2] mx-auto mt-2"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomCode" className="block text-[#2c3e50] font-semibold mb-2">
              Study Group Code
            </label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full bg-[#f8f9fa] text-[#2c3e50] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] border border-[#4a90e2]"
              placeholder="Enter group code (leave blank for main group)..."
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-[#2c3e50] font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#f8f9fa] text-[#2c3e50] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] border border-[#4a90e2]"
              placeholder="Enter your name..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#4a90e2] text-white px-6 py-2 rounded hover:bg-[#357abd] focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-colors duration-200"
          >
            Join Study Group
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#666]">
          <p>Topics: Cell Biology, Genetics, Ecology</p>
          <p className="mt-1">Perfect for group revision sessions!</p>
        </div>
      </div>
    </div>
  );
}

export default Login; 