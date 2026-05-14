import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setEmail(role === 'teacher' ? 'teacher@educlass.com' : 'student@educlass.com');
    setPassword(role === 'teacher' ? 'teacher123' : 'student123');
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">EduClass</span>
          </Link>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Welcome back</h1>
          <p className="text-surface-500 mb-8">Sign in to continue to your dashboard</p>
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-surface-200">
            <p className="text-xs font-medium text-surface-400 text-center mb-3">Quick demo access</p>
            <div className="flex gap-3">
              <button onClick={() => fillDemo('teacher')} className="flex-1 py-2.5 bg-amber-50 text-amber-700 text-sm font-semibold rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors">👩‍🏫 Teacher</button>
              <button onClick={() => fillDemo('student')} className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors">🎓 Student</button>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-surface-500">
            Don't have an account? <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">Sign up free</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="text-center text-white p-12 relative">
          <div className="text-7xl mb-6 animate-float">📚</div>
          <h2 className="text-3xl font-bold mb-4">Your Classroom, Reimagined</h2>
          <p className="text-primary-100 text-lg max-w-md">Create, teach, and manage courses with a platform built for modern education.</p>
        </div>
      </div>
    </div>
  );
}
