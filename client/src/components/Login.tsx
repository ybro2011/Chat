import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, roomCode: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !roomCode.trim()) {
      setError('Please enter both username and study group code');
      return;
    }
    onLogin(username, roomCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">GCSE Biology Revision</h1>
          <p className="text-gray-600">AQA Specification 8461</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Topic 1: Cell Biology</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-blue-800">1.1 Cell Structure</h3>
              <p className="text-gray-600">Eukaryotic and prokaryotic cells, cell specialisation, and microscopy</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-blue-800">1.2 Cell Division</h3>
              <p className="text-gray-600">Chromosomes, mitosis, and the cell cycle</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Study Group Access</h2>
          <p className="text-gray-600 mb-4">Enter your details to join the study group:</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-blue-800 font-semibold mb-2">
                Student Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-300"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="roomCode" className="block text-blue-800 font-semibold mb-2">
                Study Group Code
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-300"
                placeholder="Enter study group code"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            >
              Join Study Group
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 GCSE Biology Revision Guide</p>
          <p className="mt-1">For educational purposes only</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 