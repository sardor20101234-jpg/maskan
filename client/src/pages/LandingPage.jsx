import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { SUBJECTS } from '../utils/constants';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    fetchFeaturedCourses();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles(name)
        `)
        .limit(3);
      
      if (error) throw error;
      setFeaturedCourses(data.map(c => ({
        ...c,
        teacher_name: c.teacher?.name,
        emoji: SUBJECTS[c.subject]?.emoji || '📚'
      })));
    } catch (err) {
      console.error('Error fetching featured courses:', err);
    }
  };

  const navLinks = [
    { name: 'Homepage', href: '#home' },
    { name: 'Class Management', href: '#management' },
    { name: 'Subjects', href: '#subjects' },
    { name: 'Courses', href: '#courses' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const pricingPlans = [
    {
      name: 'Free', price: '$0',
      features: ['Up to 3 Courses', 'Basic Assignments', 'Standard Support', '50MB Storage'],
      buttonText: 'Get Started', highlight: false,
    },
    {
      name: 'Pro', price: '$19',
      features: ['Unlimited Courses', 'Advanced Grading', 'Priority Support', '10GB Storage', 'Video Conferencing'],
      buttonText: 'Try Pro Free', highlight: true,
    },
    {
      name: 'School', price: 'Custom',
      features: ['Full Institution Access', 'SSO Integration', 'Dedicated Manager', 'Unlimited Storage', 'API Access'],
      buttonText: 'Contact Sales', highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* --- Floating Header --- */}
      <header className={`fixed left-4 right-4 z-50 transition-all duration-300 ${isScrolled ? 'top-2' : 'top-4'}`}>
        <div className={`max-w-7xl mx-auto glass rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg shadow-slate-900/5 transition-all duration-500 ${isScrolled ? 'rounded-xl shadow-xl' : 'rounded-2xl'}`}>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Maskan Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-900 bg-clip-text text-transparent">
              Maskan
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg transition-colors">
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login" className="hidden sm:block px-5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
              Get Started
            </Link>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-4 shadow-2xl animate-fade-in mx-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all">
                  {link.name}
                </a>
              ))}
              <hr className="border-slate-100 my-1" />
              <Link to="/login" className="px-4 py-3 text-sm font-bold text-indigo-600">Log in</Link>
            </nav>
          </div>
        )}
      </header>

      {/* --- Section: Home (Hero) --- */}
      <section id="home" className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Mesh Gradients */}
          <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-indigo-200/20 blur-[120px] rounded-full animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[500px] bg-purple-200/20 blur-[120px] rounded-full animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 blur-[100px] rounded-full animate-blob animation-delay-4000" />
          
          {/* Colorful Blobs */}
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70" />
          <div className="absolute top-40 left-[15%] w-64 h-64 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-70" />
          <div className="absolute bottom-20 left-[20%] w-80 h-80 bg-rose-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-70" />
          <div className="absolute bottom-40 right-[15%] w-72 h-72 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-5000 opacity-70" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-indigo-100 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Next-Gen Education Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight animate-fade-in-up">
            Teach Better. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">Learn Smarter.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            The all-in-one classroom management system that empowers educators and inspires students. From interactive assignments to real-time progress tracking.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300">
              Start for Free
            </Link>
            <a href="#management" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg rounded-2xl hover:border-indigo-400 hover:text-indigo-700 hover:shadow-xl transition-all duration-300">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* --- Section: Management --- */}
      <section id="management" className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Powerful Management</h2>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                Your Classroom, <br /> Organized & <span className="text-indigo-600">Efficient.</span>
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">Say goodbye to fragmented tools. Maskan brings together course materials, announcements, and grading in a single interface.</p>
              <div className="space-y-6">
                {[
                  { title: 'One-Click Enrollment', desc: 'Students can join with a code or through the course marketplace.' },
                  { title: 'Smart Assignments', desc: 'Set due dates, points, and attach resources effortlessly.' },
                  { title: 'Centralized Communication', desc: 'Post announcements that reach all students instantly.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 text-xl border border-slate-100">✅</div>
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-all border border-slate-100">
                  <div className="text-3xl mb-4">📋</div>
                  <h4 className="font-bold mb-2">Grading</h4>
                  <p className="text-xs text-slate-400">Automated feedback tracking.</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-all text-white">
                  <div className="text-3xl mb-4">👥</div>
                  <h4 className="font-bold mb-2">Students</h4>
                  <p className="text-xs text-indigo-100">Detailed progress reports.</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-all border border-slate-100">
                  <div className="text-3xl mb-4">🔔</div>
                  <h4 className="font-bold mb-2">Updates</h4>
                  <p className="text-xs text-slate-400">Instant notifications.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-all border border-slate-100">
                  <div className="text-3xl mb-4">📂</div>
                  <h4 className="font-bold mb-2">Storage</h4>
                  <p className="text-xs text-slate-400">Safe cloud materials.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section: Subjects --- */}
      <section id="subjects" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Core Focus</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Master Foundations of <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">Knowledge.</span></h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(SUBJECTS).map(([name, subject]) => (
              <div key={name} className="group p-1 rounded-3xl bg-slate-50 hover:bg-indigo-50 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-indigo-500/10">
                <div className="bg-white rounded-[1.4rem] p-8 h-full">
                  <div className={`w-16 h-16 rounded-2xl ${subject.lightColor} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    {subject.emoji}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 text-left">{name}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 text-left">{subject.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section: Courses --- */}
      <section id="courses" className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl text-left">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Our Courses</h2>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900">Featured Learning <span className="text-indigo-600 text-left">Paths.</span></h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {featuredCourses.length === 0 ? (
              // Fallback skeleton or default message
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-slate-100 h-80 animate-pulse" />
              ))
            ) : (
              featuredCourses.map((course, i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:-translate-y-2 transition-all shadow-lg hover:shadow-indigo-500/10">
                  <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: course.cover_color || '#6366f1' }}>{course.emoji}</div>
                  <div className="p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">{course.subject}</span>
                    <h4 className="text-xl font-bold text-slate-900 mt-4 mb-2">{course.title}</h4>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">{course.description || 'Master foundations with industry experts.'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-xs font-semibold text-slate-600">{course.teacher_name}</span>
                      <Link to="/register" className="text-sm font-bold text-indigo-600">Enroll →</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- Section: Pricing --- */}
      <section id="pricing" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Pricing</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900">Simple, Transparent <span className="text-indigo-600">Plans.</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border ${plan.highlight ? 'border-indigo-200 bg-indigo-50/30 scale-105 shadow-2xl z-10' : 'border-slate-100 bg-white shadow-xl'} flex flex-col text-left`}>
                <h4 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => <li key={j} className="flex items-center gap-3 text-sm text-slate-600 font-medium">✅ {f}</li>)}
                </ul>
                <Link to="/register" className={`w-full py-4 rounded-2xl font-black text-center transition-all ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25' : 'bg-slate-900 text-white hover:bg-black'}`}>
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section: Contact --- */}
      <section id="contact" className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-8 lg:p-20 shadow-xl flex flex-col lg:flex-row gap-16 text-left">
            <div className="lg:w-1/3">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Contact</h2>
              <h3 className="text-3xl font-black text-slate-900 mb-6">Get in <span className="text-indigo-600">Touch.</span></h3>
              <p className="text-slate-500 mb-8">Revolutionize your classroom today.</p>
              <div className="space-y-4 font-semibold text-slate-700">
                <p>📧 support@maskan.com</p>
                <p>📞 +1 (555) 000-EDU</p>
              </div>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name" className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              <input type="email" placeholder="Email" className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              <textarea rows={4} placeholder="Message" className="sm:col-span-2 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
              <button className="sm:col-span-2 py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black rounded-2xl hover:shadow-2xl transition-all">Send Message</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 text-left">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Maskan Logo" className="w-12 h-12 object-contain" />
                <span className="text-2xl font-black text-white">Maskan</span>
              </div>
              <p className="text-indigo-100/60 text-lg">Empowering the next generation of educators.</p>
            </div>
            <div className="text-left">
              <h5 className="font-black text-xs uppercase text-slate-400 mb-6 tracking-widest">Navigation</h5>
              <ul className="space-y-4">
                {navLinks.map(l => <li key={l.name}><a href={l.href} className="text-indigo-100/80 hover:text-white">{l.name}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 flex justify-between text-slate-500 text-sm">
            <p>© 2026 Maskan Platform. All rights reserved.</p>
            <div className="flex gap-8"><span>Privacy</span><span>Terms</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
