
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface LoginPageProps {
  onAdminLogin: (user: string, pass: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAdminLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdminLogin = new URLSearchParams(location.search).get('admin') === 'true';

  useEffect(() => {
    setError('');
  }, [isSignUp, isAdminLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isAdminLogin) {
      const success = onAdminLogin(email, password);
      if (success) {
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid admin credentials.');
      }
      setLoading(false);
      return;
    }

    try {
        if (isSignUp) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) throw signUpError;
            if (signUpData.user) {
                // Create profile
                const { error: profileError } = await supabase.from('profiles').insert([
                    { id: signUpData.user.id, username, full_name: fullName }
                ]);
                if (profileError) throw profileError;
                alert('Account created! Please check your email for verification if enabled.');
                setIsSignUp(false);
            }
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) throw signInError;
            navigate('/user');
        }
    } catch (err: any) {
        setError(err.message || 'An error occurred during authentication.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          {isAdminLogin ? 'Admin Access' : (isSignUp ? 'Join Pelotón' : 'Welcome Back')}
        </h1>
        
        {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4 text-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {isSignUp && !isAdminLogin && (
            <>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-white"
                        placeholder="sporza_fan_1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-white"
                        placeholder="Jan Janssen"
                    />
                </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">
              {isAdminLogin ? 'Admin Username' : 'Email Address'}
            </label>
            <input
              type={isAdminLogin ? 'text' : 'email'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isAdminLogin ? 'Login' : (isSignUp ? 'Register' : 'Sign In'))}
          </button>
        </form>

        {!isAdminLogin && (
            <div className="mt-6 text-center text-sm">
                <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an account'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
