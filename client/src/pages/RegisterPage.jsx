import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackgroundParticles from '../components/BackgroundParticles';

const INTERESTING_FACTS = [
  "Knowledge is the only treasure that grows when shared with others.",
  "Maskan is your digital home for education and personal growth.",
  "The first school in the world was established in 1088 in Bologna, Italy.",
  "A single teacher can inspire thousands of students throughout their lifetime.",
  "Learning something new every day keeps your brain sharp and healthy.",
  "The word 'Maskan' means 'Home' or 'Abode' in Arabic."
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
  const [factIndex, setFactIndex] = useState(0);
  const [animateFact, setAnimateFact] = useState(true);
  const { register } = useAuth();

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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1f] p-6">
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
    <div className="min-h-screen flex relative overflow-hidden bg-[#050510]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a25] to-[#1a1a3a] z-0" />
      <BackgroundParticles />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full flex min-h-screen">
        {/* Left Content */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 text-white">
          <div className="absolute top-12 left-12 flex items-center gap-4">
            <img src="/logo.png" alt="Maskan Logo" className="w-12 h-12 object-contain rounded-full shadow-lg border border-white/10" />
            <span className="text-2xl font-black tracking-tight text-white/90">Maskan</span>
          </div>
          
          <div className="max-w-md text-center">
            <h2 className="text-5xl font-black mb-8 tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              Join Maskan
            </h2>
            <div className="h-24 overflow-hidden relative">
              <p className={`text-xl font-medium leading-relaxed italic opacity-80 transition-all duration-700 absolute inset-0 ${
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
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <img src="/logo.png" alt="Maskan Logo" className="w-10 h-10 object-contain rounded-full shadow-lg" />
              <span className="text-xl font-bold text-white">Maskan</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/50 mb-8 font-medium">Ready to start your journey?</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl animate-shake">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('student')} className={`py-3 rounded-xl border font-bold text-xs transition-all ${role === 'student' ? 'bg-white text-indigo-900 border-white' : 'bg-transparent text-white border-white/20 hover:border-white/40'}`}>
                  Student
                </button>
                <button type="button" onClick={() => setRole('teacher')} className={`py-3 rounded-xl border font-bold text-xs transition-all ${role === 'teacher' ? 'bg-white text-indigo-900 border-white' : 'bg-transparent text-white border-white/20 hover:border-white/40'}`}>
                  Teacher
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 ml-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all text-white text-sm placeholder:text-white/20" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 ml-1">Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all text-white text-sm placeholder:text-white/20" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 ml-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all text-white text-sm placeholder:text-white/20" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      required 
                      minLength={6}
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all text-white text-sm placeholder:text-white/20" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-white text-indigo-900 font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 text-xs uppercase tracking-widest shadow-xl shadow-white/5">
                {loading ? 'Processing...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/50 font-medium">
              Already have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
