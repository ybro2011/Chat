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
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.emit('join', user);

    const handleMessage = (msg: Message) => {
      setMessages(prev => [...prev, {
        user: msg.user,
        text: msg.text,
        time: msg.time
      }]);
    };

    const handleUserJoined = (data: { message: string; time: string }) => {
      setMessages(prev => [...prev, { 
        user: 'SYSTEM', 
        text: data.message, 
        time: data.time
      }]);
    };

    const handleUserLeft = (data: { message: string; time: string }) => {
      setMessages(prev => [...prev, { 
        user: 'SYSTEM', 
        text: data.message, 
        time: data.time
      }]);
    };

    socket.on('message', handleMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off('message', handleMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
    };
  }, [socket, user]);

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
      time: new Date().toLocaleTimeString()
    };

    try {
      socket.emit('message', newMessage);
      setMessage('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
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
                  ? 'bg-[#0a0a0a] text-[#00ff00] border border-[#00ff00]'
                  : 'bg-[#0a0a0a] text-[#00ff00] border border-[#00ff00]'
              }`}
            >
              {msg.user !== 'SYSTEM' && (
                <div className="font-semibold">&gt; {msg.user}</div>
              )}
              <div>{msg.text}</div>
              <div className="text-xs opacity-75 mt-1">[{msg.time}]</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[#00ff00] bg-black">
        <form 
          onSubmit={handleSubmit} 
          className="flex space-x-4"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-1 bg-[#0a0a0a] text-[#00ff00] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ff00] border border-[#00ff00]"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-[#003300] text-[#00ff00] px-6 py-2 rounded-lg hover:bg-[#004400] focus:outline-none focus:ring-2 focus:ring-[#00ff00] border border-[#00ff00]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat; 