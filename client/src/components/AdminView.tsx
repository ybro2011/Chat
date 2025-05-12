import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface Room {
  id: string;
  userCount: number;
  users: string[];
}

interface AdminViewProps {
  socket: Socket;
  onJoinRoom: (roomCode: string) => void;
}

function AdminView({ socket, onJoinRoom }: AdminViewProps) {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const handleRoomUpdate = (data: { rooms: Room[] }) => {
      setRooms(data.rooms);
    };

    socket.on('adminRooms', setRooms);
    socket.on('roomUpdate', handleRoomUpdate);

    return () => {
      socket.off('adminRooms', setRooms);
      socket.off('roomUpdate', handleRoomUpdate);
    };
  }, [socket]);

  const handleKickUser = (roomId: string, username: string) => {
    if (window.confirm(`Are you sure you want to remove ${username} from study group ${roomId}?`)) {
      socket.emit('kickUser', { roomCode: roomId, username });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Study Group Management</h1>
          <p className="text-gray-600">Monitor and manage active study groups</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Active Study Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-blue-800">Study Group: {room.id}</h3>
                    <p className="text-sm text-gray-600">
                      {room.userCount} {room.userCount === 1 ? 'student' : 'students'} online
                    </p>
                  </div>
                  <button
                    onClick={() => onJoinRoom(room.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    Join Group
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800 text-sm">Current Students:</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {room.users.map((user) => (
                      <div key={user} className="flex items-center justify-between py-1">
                        <span className="text-gray-700">{user}</span>
                        <button
                          onClick={() => handleKickUser(room.id, user)}
                          className="text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded border border-red-200 hover:border-red-300 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 italic">No active study groups at the moment</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Management Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Group Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Monitor group activity</li>
                <li>• Ensure focused discussion</li>
                <li>• Maintain study environment</li>
                <li>• Handle disruptions</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Student Support</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Guide discussions</li>
                <li>• Answer questions</li>
                <li>• Provide resources</li>
                <li>• Monitor progress</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Best Practices</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Encourage participation</li>
                <li>• Maintain order</li>
                <li>• Respect privacy</li>
                <li>• Follow guidelines</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 GCSE Biology Revision Guide</p>
          <p className="mt-1">For educational purposes only</p>
          <p className="mt-1">Based on AQA GCSE Biology Specification (8461)</p>
        </div>
      </div>
    </div>
  );
}

export default AdminView; 