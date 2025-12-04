
import React, { useState, useEffect } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Wallet, XCircle, Mail, UserPlus, User, Phone, Lock, Loader2, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../App';
import { useCreditBalance } from '../lib/hooks';

const Contact: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { balance: creditBalance } = useCreditBalance();
  
  // Dynamic Options
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [selectedProgram, setSelectedProgram] = useState('');
  
  // Registration Form State
  const [loading, setLoading] = useState(false);
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    telegram: ''
  });
  const [msg, setMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Calculate Price
  const currentPrice = priceMap[selectedProgram] || 0; 

  // Fetch available programs
  useEffect(() => {
    const fetchPrograms = async () => {
        try {
            const [mini, other, online] = await Promise.all([
                supabase.from('programs_mini').select('title, price'),
                supabase.from('programs_other').select('title, price'),
                supabase.from('courses_online').select('title, price')
            ]);

            const prices: Record<string, number> = {};
            const parsePrice = (p: string) => {
              if (!p) return 0;
              const num = parseFloat(p.replace(/[^0-9.]/g, ''));
              return isNaN(num) ? 0 : num;
            }
            
            mini.data?.forEach(p => { prices[p.title] = parsePrice(p.price); });
            other.data?.forEach(p => { prices[p.title] = parsePrice(p.price); });
            online.data?.forEach(p => { prices[`Online: ${p.title}`] = parsePrice(p.price); });
            prices['Online: All 3 Courses Bundle'] = 35;

            setPriceMap(prices);
        } catch (err) {
            console.error("Failed to load program options", err);
        }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (location.state && location.state.selectedProgram) {
        setSelectedProgram(location.state.selectedProgram);
    }
  }, [location]);

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setMsg(null);

      if (regData.password !== regData.confirmPassword) {
          setMsg({ type: 'error', text: 'Passwords do not match.' });
          return;
      }
      if (regData.password.length < 6) {
          setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
          return;
      }

      setLoading(true);

      try {
          // Check if email exists in 'admin'
          const { data: existing } = await supabase
            .from('admin')
            .select('id')
            .eq('email', regData.email)
            .maybeSingle();
          
          if (existing) {
              setMsg({ type: 'error', text: 'Email already registered.' });
              setLoading(false);
              return;
          }

          // Insert new user into 'admin' table
          const { error } = await supabase.from('admin').insert([{
              full_name: regData.fullName,
              email: regData.email,
              phone_number: regData.phone,
              password: regData.password,
              telegram_username: regData.telegram,
              program: selectedProgram || 'New Registration',
              message: 'Self Registered via Contact Page'
          }]);

          if (error) throw error;

          setMsg({ type: 'success', text: 'Registration successful! You can now sign in.' });
          // Reset form
          setRegData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', telegram: '' });
          
          setTimeout(() => {
              navigate('/signin');
          }, 2000);

      } catch (err: any) {
          console.error("Registration Error:", err);
          setMsg({ type: 'error', text: 'Failed to create account. Please try again.' });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-zinc-900/50">
      <Section>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Left: Registration Form (For New Users) */}
          <div>
              <h1 className="text-3xl font-bold mb-6 text-white">
                  {user ? 'Admin Dashboard' : 'Create Account'}
              </h1>
              <p className="text-zinc-400 mb-8">
                  {user ? 'Manage your credits and enrollment.' : 'Join KLTURE.ADMIN to access exclusive tools and courses.'}
              </p>

              {user ? (
                  /* Logged In View */
                  <div className="glass-panel p-6 mb-8 rounded-2xl relative overflow-hidden bg-black/40">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                              <Wallet size={20} />
                          </div>
                          <div>
                              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">System Credits</p>
                              <p className="text-2xl font-black text-white">${creditBalance.toFixed(2)}</p>
                          </div>
                      </div>

                      <div className="border-t border-white/5 pt-6">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-zinc-400 text-sm">Selected Program Cost:</span>
                              <span className="font-bold text-white">${currentPrice.toFixed(2)}</span>
                          </div>
                          
                          {selectedProgram && (
                              <div className="text-sm text-zinc-500 mb-4 text-right">
                                  Program: <span className="text-zinc-300">{selectedProgram}</span>
                              </div>
                          )}
                          
                          <button className="w-full py-3 bg-red-600 text-white rounded-lg font-bold mt-4 hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                              <UserPlus size={18} /> Process Enrollment
                          </button>
                      </div>
                  </div>
              ) : (
                  /* Registration Form */
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                      {msg && (
                        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-bold ${msg.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                            {msg.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                            {msg.text}
                        </div>
                      )}
                      
                      <form onSubmit={handleRegister} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Full Name</label>
                              <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                  <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-red-500 outline-none" placeholder="John Doe" value={regData.fullName} onChange={e => setRegData({...regData, fullName: e.target.value})} />
                              </div>
                          </div>
                          
                          <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Email Address</label>
                              <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                  <input required type="email" className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-red-500 outline-none" placeholder="john@example.com" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input required type="tel" className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-red-500 outline-none" placeholder="012..." value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Telegram</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">@</span>
                                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-white focus:border-red-500 outline-none" placeholder="username" value={regData.telegram} onChange={e => setRegData({...regData, telegram: e.target.value})} />
                                </div>
                            </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Password</label>
                              <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                  <input required type="password" className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-red-500 outline-none" placeholder="••••••" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} />
                              </div>
                          </div>

                           <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Confirm Password</label>
                              <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                  <input required type="password" className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-red-500 outline-none" placeholder="••••••" value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})} />
                              </div>
                          </div>
                          
                          {selectedProgram && (
                              <div className="bg-red-900/20 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                                  <BookOpen size={16} className="text-red-500" />
                                  <span className="text-xs text-red-200">Registering interest for: <b>{selectedProgram}</b></span>
                              </div>
                          )}

                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg"
                          >
                             {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
                             Create Account
                          </button>
                          
                          <p className="text-center text-xs text-zinc-500 pt-2">
                              Already have an account? <Link to="/signin" className="text-red-500 font-bold hover:underline">Sign In</Link>
                          </p>
                      </form>
                  </div>
              )}
          </div>

          {/* Right: Support Contact */}
          <div>
              <h2 className="text-xl font-bold mb-6 text-white">Admin Support</h2>
              <div className="glass-panel p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white font-bold text-xl border border-white/10">Z</div>
                      <div>
                          <p className="font-bold text-white">Zell</p>
                          <p className="text-zinc-500 text-xs uppercase font-bold">System Administrator</p>
                      </div>
                  </div>
                  <div className="space-y-3">
                      <a href="mailto:zell@klture.media" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <Mail size={18} className="text-zinc-400" />
                          <span className="text-sm text-zinc-300">zell@klture.media</span>
                      </a>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <CheckCircle size={18} className="text-green-500" />
                          <span className="text-sm text-zinc-300">Primary Contact for all system issues.</span>
                      </div>
                  </div>
              </div>
          </div>

        </div>
      </Section>
    </div>
  );
};

export default Contact;
