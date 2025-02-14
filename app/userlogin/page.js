'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const LOCAL_STORAGE_KEY = 'admin_auth_data';

  useEffect(() => {
    // Check if user is already logged in via local storage
    const userData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (userData) {
      router.push('/userdashboard'); // Redirect if already logged in
    } else {
      setIsLoading(false); // Allow login form to render
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/userapi/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data in localStorage
        if (res.headers.get('X-User-Data')) {
          localStorage.setItem(LOCAL_STORAGE_KEY, res.headers.get('X-User-Data'));
        }
        router.push('/userdashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.log(err);
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white px-8 py-12 shadow-lg rounded-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Editor Login</h1>
          </div>
          {error && <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
