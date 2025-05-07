import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  user: string;
  text: string;
  time: string;
}

interface ChatProps {
  socket: Socket;
  username: string;
}

function Chat({ socket, username }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
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
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#0a0a0a] rounded-lg hacker-border">
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.user === username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.user === username
                    ? 'bg-[#003300] text-[#00ff00]'
                    : message.user === 'SYSTEM'
                    ? 'bg-[#0a0a0a] text-[#00ff00] hacker-border'
                    : 'bg-[#0a0a0a] text-[#00ff00] hacker-border'
                }`}
              >
                {message.user !== 'SYSTEM' && (
                  <div className="font-semibold hacker-text">&gt; {message.user}</div>
                )}
                <div className="hacker-text">{message.text}</div>
                <div className="text-xs opacity-75 mt-1 hacker-text">[{message.time}]</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#00ff00]">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-md hacker-input p-2"
              placeholder="ENTER_MESSAGE..."
            />
            <button
              type="submit"
              className="px-4 py-2 hacker-button rounded-md"
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat; 