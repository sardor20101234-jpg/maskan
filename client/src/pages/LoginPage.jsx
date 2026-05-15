import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INTERESTING_FACTS = [
  "Did you know? Humans share about 50% of their DNA with bananas!",
  "A group of flamingos is called a 'flamboyance'.",
  "Octopuses have three hearts and blue blood.",
  "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
  "Maskan means 'Home' - let this be your home for learning."
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fact = INTERESTING_FACTS[Math.floor(Math.random() * INTERESTING_FACTS.length)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(identifier, password);
      navigate(user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800">
      {/* Left Content */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 text-white relative">
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-xl">M</div>
          <span className="text-2xl font-black tracking-tight">Maskan</span>
        </div>
        
        <div className="max-w-md text-center">
          <div className="text-8xl mb-8 animate-float">🚀</div>
          <h2 className="text-4xl font-bold mb-6">Welcome Back</h2>
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
          
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Sign In</h1>
          <p className="text-surface-500 mb-8">Access your personalized dashboard</p>
          
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl animate-shake">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5 ml-1">Email or Username</label>
              <input 
                type="text" 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                placeholder="you@example.com or username" 
                required 
                className="w-full px-5 py-3.5 bg-surface-50 border border-surface-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-surface-900 text-sm" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => alert('Password reset feature coming soon!')} className="text-[10px] font-bold text-primary-600 hover:underline uppercase tracking-wide">Forgot?</button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
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
            
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-surface-50 border-surface-300 rounded focus:ring-primary-500 focus:ring-2" 
              />
              <label htmlFor="remember-me" className="ml-2 text-sm font-medium text-surface-600 cursor-pointer">Remember me</label>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all disabled:opacity-50 text-sm tracking-wide">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-500 font-medium">
            Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
