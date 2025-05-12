import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface LoginProps {
  onLogin: (username: string, roomCode: string) => void;
}

interface ActiveRoom {
  name: string;
  userCount: number;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [activeRooms, setActiveRooms] = useState<ActiveRoom[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Connect to the server
    const serverUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:10000'
      : window.location.origin;
    
    console.log('Connecting to server at:', serverUrl);
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to server. Please try again later.');
    });

    // Listen for active rooms updates
    newSocket.on('activeRooms', (rooms: ActiveRoom[]) => {
      console.log('Received active rooms:', rooms);
      setActiveRooms(rooms);
    });

    // Request initial active rooms
    newSocket.emit('getActiveRooms');

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.close();
    };
  }, []);

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
          <p className="text-sm text-gray-500 mt-2">Exam Board: AQA | Course Code: 8461 | Paper 1 & 2</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Topic 1: Cell Biology</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-blue-800">1.1 Cell Structure</h3>
                <p className="text-gray-600">Eukaryotic and prokaryotic cells, cell specialisation, and microscopy</p>
                <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                  <li>Animal and plant cells</li>
                  <li>Bacterial cells</li>
                  <li>Microscopy techniques</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-blue-800">1.2 Cell Division</h3>
                <p className="text-gray-600">Chromosomes, mitosis, and the cell cycle</p>
                <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                  <li>Mitosis stages</li>
                  <li>Cell cycle phases</li>
                  <li>Stem cells</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Topic 2: Organisation</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-blue-800">2.1 Principles of Organisation</h3>
                <p className="text-gray-600">Cells, tissues, organs, and organ systems</p>
                <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                  <li>Levels of organisation</li>
                  <li>Digestive system</li>
                  <li>Enzymes</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-blue-800">2.2 Plant Tissues</h3>
                <p className="text-gray-600">Plant tissues, organs, and transport systems</p>
                <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                  <li>Leaf structure</li>
                  <li>Transpiration</li>
                  <li>Xylem and phloem</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Past Papers & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-blue-800">Paper 1</h3>
                <p className="text-gray-600">Topics: Cell Biology, Organisation, Infection & Response, Bioenergetics</p>
                <div className="mt-2 space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">2023 Papers</p>
                    <p className="text-sm text-gray-500 mt-1">Links coming soon...</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">2022 Papers</p>
                    <p className="text-sm text-gray-500 mt-1">Links coming soon...</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">2021 Papers</p>
                    <p className="text-sm text-gray-500 mt-1">Links coming soon...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-blue-800">Paper 2</h3>
                <p className="text-gray-600">Topics: Homeostasis, Inheritance, Ecology</p>
                <div className="mt-2 space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">2023 Papers</p>
                    <p className="text-sm text-gray-500 mt-1">Links coming soon...</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">2022 Papers</p>
                    <p className="text-sm text-gray-500 mt-1">Links coming soon...</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">2021 Papers</p>
                    <p className="text-sm text-gray-500 mt-1">Links coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-700">Mark Schemes</p>
                <p className="text-sm text-gray-500 mt-1">Coming soon...</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-700">Examiner Reports</p>
                <p className="text-sm text-gray-500 mt-1">Coming soon...</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-700">Practice Questions</p>
                <p className="text-sm text-gray-500 mt-1">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Exam Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Command Words</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Describe: Give details</li>
                <li>• Explain: Give reasons</li>
                <li>• Compare: Identify similarities</li>
                <li>• Evaluate: Make a judgement</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Practical Skills</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Required practicals</li>
                <li>• Scientific methods</li>
                <li>• Data analysis</li>
                <li>• Graph drawing</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Revision Strategy</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Past papers</li>
                <li>• Mind maps</li>
                <li>• Flashcards</li>
                <li>• Group study</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Study Group Access</h2>
          <p className="text-gray-600 mb-4">Join a study group to discuss biology topics and prepare for your exams:</p>
          
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
          <p className="mt-1">Based on AQA GCSE Biology Specification (8461)</p>
        </div>

        {/* Active Study Groups Footer */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Active Study Groups</h3>
          {activeRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeRooms.map((room) => (
                <div 
                  key={room.name}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setRoomCode(room.name)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800">{room.name}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {room.userCount} {room.userCount === 1 ? 'student' : 'students'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Click to join</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No active study groups at the moment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 