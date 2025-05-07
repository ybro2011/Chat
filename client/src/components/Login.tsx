import { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password === 'super_safe1') {
      onLogin(username.trim());
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#0a0a0a] rounded-lg hacker-border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-[#00ff00] hacker-text">
            &gt; Enter username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md hacker-input p-2"
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#00ff00] hacker-text">
            &gt; Enter password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md hacker-input p-2"
            placeholder="Password"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm hacker-text">
            &gt; {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 hacker-button rounded-md"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}

export default Login; 