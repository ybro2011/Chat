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
    <div className="min-h-screen bg-[#f0f8ff] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-2">GCSE Biology Revision</h1>
          <p className="text-[#666]">AQA Specification 8461</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-4">Topic 1: Cell Biology</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-[#4a90e2] pl-4">
              <h3 className="font-semibold text-[#2c3e50]">1.1 Cell Structure</h3>
              <p className="text-[#666]">Eukaryotic and prokaryotic cells, cell specialisation, and microscopy</p>
            </div>
            <div className="border-l-4 border-[#4a90e2] pl-4">
              <h3 className="font-semibold text-[#2c3e50]">1.2 Cell Division</h3>
              <p className="text-[#666]">Chromosomes, mitosis, and the cell cycle</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-4">Study Group Access</h2>
          <p className="text-[#666] mb-4">Enter your details to access the study materials:</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="roomCode" className="block text-[#2c3e50] font-semibold mb-2">
                Study Group
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full bg-[#f8f9fa] text-[#2c3e50] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] border border-[#4a90e2]"
                placeholder="Enter study group (leave blank for main group)..."
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-[#2c3e50] font-semibold mb-2">
                Student Name
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
              Access Study Materials
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-[#666]">
          <p>© 2024 GCSE Biology Revision Guide</p>
          <p className="mt-1">For educational purposes only</p>
        </div>
      </div>
    </div>
  );
}

export default Login; 