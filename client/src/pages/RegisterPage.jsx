import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      navigate(user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-700 to-primary-800 relative overflow-hidden">
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="text-center text-white p-12 relative">
          <div className="text-7xl mb-6 animate-float">🎓</div>
          <h2 className="text-3xl font-bold mb-4">Join EduClass Today</h2>
          <p className="text-emerald-100 text-lg max-w-md">Whether you're teaching or learning, we've built the perfect space for you.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">EduClass</span>
          </Link>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Create your account</h1>
          <p className="text-surface-500 mb-8">Start your learning journey in seconds</p>
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('student')} className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${role === 'student' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-surface-200 text-surface-500 hover:border-surface-300'}`}>
                  🎓 Student
                </button>
                <button type="button" onClick={() => setRole('teacher')} className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${role === 'teacher' ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-surface-200 text-surface-500 hover:border-surface-300'}`}>
                  👩‍🏫 Teacher
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-surface-500">
            Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
