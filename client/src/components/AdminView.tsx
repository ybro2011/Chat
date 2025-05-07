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

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[#00ff00] text-2xl mb-6">&gt; Active Chat Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-[#0a0a0a] p-4 rounded-lg border border-[#00ff00]"
            >
              <div className="text-[#00ff00]">
                <div className="font-semibold">&gt; Room: {room.id}</div>
                <div className="text-sm opacity-75">
                  &gt; Users: {room.userCount}
                </div>
                <div className="text-sm opacity-75 mt-2">
                  &gt; Online: {room.users.join(', ')}
                </div>
                <button
                  onClick={() => onJoinRoom(room.id)}
                  className="mt-4 w-full bg-[#003300] text-[#00ff00] px-4 py-2 rounded-lg hover:bg-[#004400] focus:outline-none focus:ring-2 focus:ring-[#00ff00] border border-[#00ff00]"
                >
                  Join Room
                </button>
              </div>
            </div>
          ))}
        </div>
        {rooms.length === 0 && (
          <div className="text-[#00ff00] text-center mt-8">
            &gt; No active chat rooms
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminView; 