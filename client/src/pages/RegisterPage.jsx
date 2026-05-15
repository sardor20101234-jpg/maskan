import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackgroundParticles from '../components/BackgroundParticles.jsx';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in-up border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h1>
          <p className="text-slate-500 mb-8">
            Your account has been registered. 
            Please check your email to verify your account before logging in.
          </p>
          <Link to="/login" className="block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
      {/* Lighter Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/50 z-0" />
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
              Join Maskan
            </h2>
            <div className="h-24 overflow-hidden relative">
              <p className={`text-xl font-medium leading-relaxed italic text-indigo-800 opacity-70 transition-all duration-700 absolute inset-0 ${
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
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-black tracking-tight">Create Account</h1>
            <p className="text-slate-500 mb-8 font-medium">Ready to start your journey?</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-2xl animate-shake">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('student')} className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${role === 'student' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}>
                  Student
                </button>
                <button type="button" onClick={() => setRole('teacher')} className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${role === 'teacher' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}>
                  Teacher
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-900 text-sm placeholder:text-slate-300" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-900 text-sm placeholder:text-slate-300" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-900 text-sm placeholder:text-slate-300" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      required 
                      minLength={6}
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-900 text-sm placeholder:text-slate-300" 
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
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 mt-4 text-xs uppercase tracking-widest">
                {loading ? 'Processing...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-indigo-600 hover:underline font-bold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
