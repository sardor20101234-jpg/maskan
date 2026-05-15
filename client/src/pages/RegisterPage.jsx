import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INTERESTING_FACTS = [
  "Did you know? The first school in the world was established in 1088!",
  "A single teacher can inspire thousands of students throughout their career.",
  "Learning something new every day keeps your brain sharp and healthy.",
  "Knowledge is the only treasure that grows when shared with others.",
  "Maskan is your digital home for education and growth."
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();

  const fact = INTERESTING_FACTS[Math.floor(Math.random() * INTERESTING_FACTS.length)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, username, email, password, role);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in-up border border-surface-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Account Created!</h1>
          <p className="text-surface-500 mb-8">
            Your account has been registered. 
            Please check your email to verify your account before logging in.
          </p>
          <Link to="/login" className="block w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg transition-all">
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800">
      {/* Left Content */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 text-white relative">
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-xl">M</div>
          <span className="text-2xl font-black tracking-tight">Maskan</span>
        </div>
        
        <div className="max-w-md text-center">
          <div className="text-8xl mb-8 animate-float">🌟</div>
          <h2 className="text-4xl font-bold mb-6">Join Maskan Today</h2>
          <p className="text-indigo-100 text-xl font-medium leading-relaxed italic opacity-90">
            "{fact}"
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 lg:p-12 animate-fade-in-up border border-white/20">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold text-surface-900">Maskan</span>
          </div>
          
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Create Account</h1>
          <p className="text-surface-500 mb-8">Ready to start your journey?</p>
          
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl animate-shake">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('student')} className={`py-3 rounded-xl border-2 font-semibold text-xs transition-all ${role === 'student' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-100 text-surface-500 hover:border-surface-200'}`}>
                🎓 Student
              </button>
              <button type="button" onClick={() => setRole('teacher')} className={`py-3 rounded-xl border-2 font-semibold text-xs transition-all ${role === 'teacher' ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-surface-100 text-surface-500 hover:border-surface-200'}`}>
                👩‍🏫 Teacher
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full px-5 py-3.5 bg-surface-50 border border-surface-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-surface-900 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5 ml-1">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe123" required className="w-full px-5 py-3.5 bg-surface-50 border border-surface-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-surface-900 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full px-5 py-3.5 bg-surface-50 border border-surface-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-surface-900 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    minLength={6}
                    className="w-full px-5 py-3.5 bg-surface-50 border border-surface-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-surface-900 text-sm" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-500 transition-colors"
                  >
                    {showPassword ? '👁️' : '🕶️'}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all disabled:opacity-50 mt-4 text-sm tracking-wide">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-500 font-medium">
            Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
