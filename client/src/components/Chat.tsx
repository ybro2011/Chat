import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  user: string;
  text: string;
  time: string;
  room: string;
}

interface ChatProps {
  user: string;
  room: string;
  socket: Socket;
}

function Chat({ user, room, socket }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.emit('join', { username: user, roomCode: room });

    const handleMessage = (msg: Message) => {
      console.log('Received message:', msg);
      if (msg.room === room) {
        setMessages(prev => [...prev, msg]);
      }
    };

    const handleUserJoined = (data: { message: string; time: string; users: string[] }) => {
      console.log('User joined:', data);
      setMessages(prev => [...prev, { 
        user: 'SYSTEM', 
        text: data.message, 
        time: data.time,
        room
      }]);
      setUsers(data.users);
    };

    const handleUserLeft = (data: { message: string; time: string; users: string[] }) => {
      console.log('User left:', data);
      setMessages(prev => [...prev, { 
        user: 'SYSTEM', 
        text: data.message, 
        time: data.time,
        room
      }]);
      setUsers(data.users);
    };

    socket.on('message', handleMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off('message', handleMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
    };
  }, [socket, user, room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!message.trim()) return;

    const newMessage: Message = {
      user,
      text: message.trim(),
      time: new Date().toLocaleTimeString(),
      room
    };

    try {
      console.log('Sending message:', newMessage);
      socket.emit('message', newMessage);
      setMessage('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLeave = () => {
    // Implement the leave group logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-purple-800">Study Group: {room}</h2>
              <p className="text-gray-600">Discuss chemistry topics with your peers</p>
              <p className="text-sm text-gray-500 mt-1">Active members: {users.join(', ')}</p>
            </div>
            <button
              onClick={handleLeave}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
            >
              Leave Group
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.user === user
                    ? 'text-right'
                    : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[70%] rounded-lg p-3 ${
                    msg.user === user
                      ? 'bg-indigo-600 text-white'
                      : 'bg-purple-100 text-gray-800'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {msg.user === user ? 'You' : msg.user}
                  </div>
                  <div>{msg.text}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-gray-50 text-gray-800 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-indigo-300"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat; 