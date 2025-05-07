import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  user: string;
  text: string;
  time: string;
}

interface ChatProps {
  user: string;
  socket: Socket;
}

function Chat({ user, socket }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.emit('join', user);

    socket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('userJoined', ({ message }) => {
      setMessages((prev) => [...prev, { user: 'SYSTEM', text: message, time: new Date().toLocaleTimeString() }]);
    });

    socket.on('userLeft', ({ message }) => {
      setMessages((prev) => [...prev, { user: 'SYSTEM', text: message, time: new Date().toLocaleTimeString() }]);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { user, text: message });
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#0a0a0a] rounded-lg hacker-border">
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user === user ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.user === user
                    ? 'bg-[#003300] text-[#00ff00]'
                    : msg.user === 'SYSTEM'
                    ? 'bg-[#0a0a0a] text-[#00ff00] hacker-border'
                    : 'bg-[#0a0a0a] text-[#00ff00] hacker-border'
                }`}
              >
                {msg.user !== 'SYSTEM' && (
                  <div className="font-semibold hacker-text">&gt; {msg.user}</div>
                )}
                <div className="hacker-text">{msg.text}</div>
                <div className="text-xs opacity-75 mt-1 hacker-text">[{msg.time}]</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t border-[#00ff00]">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat; 