import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  user: string;
  text: string;
  time: string;
  color: string;
}

interface ChatProps {
  socket: Socket;
  username: string;
  room: string;
  userColor: string;
  isAdmin?: boolean;
}

function Chat({ socket, username, room, userColor, isAdmin = false }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleMessage = (message: Message) => {
      console.log('Message received:', message);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    const handleUserJoined = ({ message, time, users: roomUsers }: { message: string; time: string; users: string[] }) => {
      setMessages(prev => [...prev, { user: 'System', text: message, time, color: '#00ff00' }]);
      setUsers(roomUsers);
      scrollToBottom();
    };

    const handleUserLeft = ({ message, time, users: roomUsers }: { message: string; time: string; users: string[] }) => {
      setMessages(prev => [...prev, { user: 'System', text: message, time, color: '#00ff00' }]);
      setUsers(roomUsers);
      scrollToBottom();
    };

    const handleKicked = ({ message }: { message: string }) => {
      alert(message);
      window.location.reload();
    };

    // Join the room when component mounts
    socket.emit('join', { username, room, color: userColor });

    socket.on('message', handleMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('kicked', handleKicked);

    return () => {
      socket.off('message', handleMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('kicked', handleKicked);
    };
  }, [socket, username, room, userColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      socket.emit('message', {
        text: messageInput,
        room,
        color: userColor
      });
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleKickUser = (usernameToKick: string) => {
    if (window.confirm(`Are you sure you want to kick ${usernameToKick}?`)) {
      socket.emit('kickUser', { roomCode: room, username: usernameToKick });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#00ff00]">
        <div className="text-[#00ff00]">
          <h2 className="text-xl">&gt; Room: {room}</h2>
          <p className="text-sm opacity-75">&gt; Logged in as: {username} {isAdmin && '(Admin)'}</p>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.time}-${message.user}-${index}`}
              className={`p-3 rounded-lg ${
                message.user === username
                  ? 'bg-[#003300] ml-auto'
                  : 'bg-[#0a0a0a]'
              } max-w-[80%] break-words`}
            >
              <div style={{ color: message.color }}>
                <span className="font-bold">&gt; {message.user}</span>
                <span className="text-sm opacity-75 ml-2">{message.time}</span>
              </div>
              <p style={{ color: message.color }} className="mt-1 whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {isAdmin && (
          <div className="w-64 border-l border-[#00ff00] p-4">
            <h3 className="text-[#00ff00] text-lg mb-4">&gt; Online Users</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user} className="flex items-center justify-between">
                  <span className="text-[#00ff00]">&gt; {user}</span>
                  {user !== username && (
                    <button
                      onClick={() => handleKickUser(user)}
                      className="text-[#00ff00] hover:text-red-500 px-2 py-1 rounded border border-[#00ff00] hover:border-red-500"
                    >
                      Kick
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#00ff00]">
        <div className="flex space-x-4">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{ color: userColor }}
            className="flex-1 bg-[#0a0a0a] p-3 rounded-lg border border-[#00ff00] focus:outline-none focus:ring-2 focus:ring-[#00ff00] resize-none text-[#00ff00]"
            rows={3}
          />
          <button
            type="submit"
            style={{ color: userColor, borderColor: userColor }}
            className="bg-[#003300] px-6 py-3 rounded-lg hover:bg-[#004400] focus:outline-none focus:ring-2 border self-end"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat; 