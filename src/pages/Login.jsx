import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      
      const decoded = jwtDecode(token);
      login({ id: decoded.id, name: decoded.name, token }, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-dark-800/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl border border-dark-700/50">
        <div className="mb-8 text-center bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue to AI Game Hub</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-dark-700 bg-dark-900/50 py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-dark-700 bg-dark-900/50 py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
