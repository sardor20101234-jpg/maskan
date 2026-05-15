import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  
  const bgRef = useRef(null);

  // Rotate facts every 40 seconds with animation
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

  // Cursor follow effect
  const handleMouseMove = (e) => {
    if (!bgRef.current) return;
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 40;
    const moveY = (clientY - window.innerHeight / 2) / 40;
    bgRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
  };

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
    <div onMouseMove={handleMouseMove} className="min-h-screen flex relative overflow-hidden bg-[#050510]">
      {/* Dynamic Background with Mouse Follow */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 transition-transform duration-500 ease-out opacity-30 scale-110"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'hue-rotate(240deg) brightness(0.8)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050510] via-transparent to-[#101030]" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full flex min-h-screen">
        {/* Left Content */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 text-white">
          <div className="absolute top-12 left-12 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center font-bold text-xl border border-white/20">M</div>
            <span className="text-2xl font-black tracking-tight text-white/90">Maskan</span>
          </div>
          
          <div className="max-w-md text-center">
            <h2 className="text-5xl font-black mb-8 tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <div className="h-24 overflow-hidden relative">
              <p className={`text-xl font-medium leading-relaxed italic opacity-70 transition-all duration-700 absolute inset-0 ${
                animateFact ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}>
                "{INTERESTING_FACTS[factIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 lg:p-12 border border-white/10">
            <div className="lg:hidden mb-8 flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold text-white">Maskan</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
            <p className="text-white/50 mb-8 font-medium">Access your personalized dashboard</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl animate-shake">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 ml-1">Email or Username</label>
                <input 
                  type="text" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  placeholder="Email or username" 
                  required 
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all text-white text-sm placeholder:text-white/20" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" onClick={() => alert('Reset feature coming soon!')} className="text-[10px] font-black text-white/60 hover:text-white transition-colors uppercase tracking-widest">Forgot?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all text-white text-sm placeholder:text-white/20" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-xs font-bold"
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
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-white/20" 
                />
                <label htmlFor="remember-me" className="ml-2 text-xs font-bold text-white/60 cursor-pointer uppercase tracking-wider">Keep me signed in</label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-white text-indigo-900 font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-xs uppercase tracking-widest">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/50 font-medium">
              Don't have an account? <Link to="/register" className="text-white hover:underline">Join free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
