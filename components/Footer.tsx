
import React from 'react';
import { useLang } from '../App';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLang();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold tracking-tight mb-1">KLTURE<span className="text-red-600">.ADMIN</span></h2>
            <p className="text-zinc-500 text-xs">{t.footer.summary}</p>
          </div>

          <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/10">
             <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">System Support</span>
                <a 
                  href="mailto:zell@klture.media" 
                  className="flex items-center gap-2 text-white hover:text-red-400 transition-colors text-sm font-medium"
                >
                  <Mail size={16} /> zell@klture.media
                </a>
             </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
