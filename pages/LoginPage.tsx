
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginPageProps {
  onAdminLogin: (user: string, pass: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAdminLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isAdminLogin = new URLSearchParams(location.search).get('admin') === 'true';

  useEffect(() => {
    setUsername(isAdminLogin ? '' : 'jan@example.com');
    setPassword(isAdminLogin ? '' : 'password');
    setError('');
  }, [isAdminLogin]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAdminLogin) {
      const success = onAdminLogin(username, password);
      if (success) {
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid admin credentials.');
      }
    } else {
      // In a real app, you would handle user authentication here.
      // For this mock, we just navigate to the user page.
      navigate('/user');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          {isAdminLogin ? 'Admin Login' : 'Login'}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              {isAdminLogin ? 'Username' : 'Email Address'}
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type={isAdminLogin ? 'text' : 'email'}
                autoComplete={isAdminLogin ? 'username' : 'email'}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-gray-700"
              />
            </div>
          </div>

          {!isAdminLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;