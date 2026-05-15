import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackgroundParticles from '../components/BackgroundParticles.jsx';

const INTERESTING_FACTS = [
  "Did you know? Humans share about 50% of their DNA with bananas!",
  "A group of flamingos is called a 'flamboyance'.",
  "Octopuses have three hearts and blue blood.",
  "The Eiffel Tower can be 15 cm taller during the summer due to heat.",
  "Maskan is your home for digital learning and growth.",
  "Learning is the only thing the mind never exhausts."
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [animateFact, setAnimateFact] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateFact(false);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % INTERESTING_FACTS.length);
        setAnimateFact(true);
      }, 500);
    }, 40000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
      {/* Lighter Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-blue-50/30 to-indigo-50/50 z-0" />
      <BackgroundParticles dark={true} />

      <div className="relative z-10 w-full flex min-h-screen">
        {/* Left Content */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 text-slate-900">
          <div className="absolute top-12 left-12 flex items-center gap-4">
            <img src="/logo.png" alt="Maskan Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-black tracking-tight text-indigo-900">Maskan</span>
          </div>
          
          <div className="max-w-md text-center">
            <h2 className="text-5xl font-black mb-8 tracking-tighter text-indigo-950">
              Welcome Back
            </h2>
            <div className="h-24 overflow-hidden relative">
              <p className={`text-xl font-medium leading-relaxed italic text-indigo-800 opacity-60 transition-all duration-700 absolute inset-0 ${
                animateFact ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}>
                "{INTERESTING_FACTS[factIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 lg:p-12 border border-white/50">
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <img src="/logo.png" alt="Maskan Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-indigo-900">Maskan</span>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-black tracking-tight">Sign In</h1>
            <p className="text-slate-500 mb-8 font-medium">Access your personalized dashboard</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-2xl animate-shake">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Email or Username</label>
                <input 
                  type="text" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  placeholder="Email or username" 
                  required 
                  className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-900 text-sm placeholder:text-slate-300" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" onClick={() => alert('Reset feature coming soon!')} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">Forgot?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-900 text-sm placeholder:text-slate-300" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" 
                />
                <label htmlFor="remember-me" className="ml-2 text-xs font-bold text-slate-600 cursor-pointer uppercase tracking-wider">Keep me signed in</label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 text-xs uppercase tracking-widest">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
              Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline font-bold">Join free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
