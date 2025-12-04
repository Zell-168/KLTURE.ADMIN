
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang, useAuth } from '../App';
import { Menu, X, User, LogOut, LogIn, LayoutDashboard, Users, Shield, Package, Wallet } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t, lang, toggleLang } = useLang();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Admin Nav Links
  const navLinks = [
    { name: t.nav.home, path: '/', icon: <LayoutDashboard size={18} /> },
    { name: t.nav.community, path: '/community', icon: <Users size={18} /> },
    { name: t.nav.products, path: '/products', icon: <Package size={18} /> },
    { name: t.nav.topUp, path: '/topup', icon: <Wallet size={18} /> },
    { name: t.trainers.title, path: '/trainers', icon: <Shield size={18} /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={() => setIsOpen(false)}>
             <span className="font-black text-xl tracking-tighter text-white">
                KLTURE<span className="text-red-600"> ADMIN</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            <button 
              onClick={toggleLang}
              className="text-xs font-bold text-zinc-500 hover:text-white bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-all uppercase"
            >
              {lang}
            </button>

            {user ? (
              <div className="flex items-center gap-2 ml-4">
                 <Link
                  to="/profile"
                  className="flex items-center gap-2 text-zinc-200 hover:text-white font-semibold text-sm bg-white/5 border border-white/10 px-3 py-1.5 rounded-md transition-all hover:bg-white/10"
                >
                  <User size={16} />
                  {t.nav.profile}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="ml-4 bg-white text-black px-4 py-1.5 rounded-md text-sm font-bold hover:bg-zinc-200 transition-all"
              >
                {t.nav.signIn}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 absolute w-full left-0 top-16 border-b border-white/10 shadow-2xl">
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className="text-left text-base font-medium flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-white/5 p-3 rounded-lg"
              >
                {link.icon}
                {link.name}
              </button>
            ))}
            
            <div className="h-px bg-white/10 my-2"></div>
            
            {user ? (
              <>
                <button
                    onClick={() => handleNav('/profile')}
                    className="text-left text-base font-medium flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-white/5 p-3 rounded-lg"
                >
                    <User size={18} /> {t.nav.profile}
                </button>
                <button
                    onClick={handleLogout}
                    className="text-left text-base font-medium flex items-center gap-3 text-red-500 hover:bg-red-900/10 p-3 rounded-lg"
                >
                    <LogOut size={18} /> {t.nav.signOut}
                </button>
              </>
            ) : (
                <button
                    onClick={() => handleNav('/signin')}
                    className="text-left text-base font-medium flex items-center gap-3 text-white bg-red-600 p-3 rounded-lg justify-center"
                >
                    <LogIn size={18} /> {t.nav.signIn}
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
