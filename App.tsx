
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { TranslationData, Language, User } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Community from './pages/Community';
import TopUp from './pages/TopUp';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Trainers from './pages/Trainers';
import LearningClassroom from './pages/LearningClassroom';
import { Shield } from 'lucide-react';

// Language Context
interface LangContextType {
  lang: Language;
  t: TranslationData;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within a LangProvider');
  return context;
};

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  // Check local storage for user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('klture_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('klture_user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('klture_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('klture_user');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'kh' : 'en');
  };

  const t = TRANSLATIONS[lang];

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <HashRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen font-sans text-white relative bg-zinc-950">
            
            <Navbar />
            <main className="flex-grow pt-16 relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/community" element={<Community />} />
                <Route path="/topup" element={<TopUp />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/learning/:courseId" element={<LearningClassroom />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Admin Floating Action */}
            <Link 
              to="/trainers" 
              className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-full font-bold shadow-2xl hover:bg-white/20 transition-all flex items-center gap-2 hover:scale-105 border border-white/10 group"
            >
              <Shield size={18} className="text-red-500" />
              <span className="text-sm">Team</span>
            </Link>
          </div>
        </HashRouter>
      </AuthContext.Provider>
    </LangContext.Provider>
  );
};

export default App;
