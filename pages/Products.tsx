
import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { DbMiniProgram, DbOtherProgram, DbOnlineCourse, DbFreeCourse, DbZellPlusContent, DbPodcast } from '../types';
import { Loader2, Package, Star, Zap, Video, PlayCircle, Mic, PlusSquare, Image as ImageIcon } from 'lucide-react';
import VideoPlayer from '../components/ui/VideoPlayer';

const Products: React.FC = () => {
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  
  // State for all 6 categories
  const [miniPrograms, setMiniPrograms] = useState<DbMiniProgram[]>([]);
  const [otherPrograms, setOtherPrograms] = useState<DbOtherProgram[]>([]);
  const [onlineCourses, setOnlineCourses] = useState<DbOnlineCourse[]>([]);
  const [freeCourses, setFreeCourses] = useState<DbFreeCourse[]>([]);
  const [zellPlus, setZellPlus] = useState<DbZellPlusContent[]>([]);
  const [podcasts, setPodcasts] = useState<DbPodcast[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Helper function for Online Courses with fallback
        const fetchOnlineCourses = async () => {
            const { data, error } = await supabase.from('online_courses_management').select('*').order('id');
            if (error || !data) {
                // Fallback to old table name if new one doesn't exist or errors
                return await supabase.from('courses_online').select('*').order('id');
            }
            return { data, error };
        };

        // Parallel fetching
        const [mini, other, online, free, plus, cast] = await Promise.all([
            supabase.from('programs_mini').select('*').order('id'),
            supabase.from('programs_other').select('*').order('id'),
            fetchOnlineCourses(),
            supabase.from('courses_free').select('*').order('created_at', {ascending: false}),
            supabase.from('zell_plus_contents').select('*').order('created_at', {ascending: false}),
            supabase.from('zell_podcast').select('*').order('created_at', {ascending: false})
        ]);

        if (mini.data) setMiniPrograms(mini.data);
        if (other.data) setOtherPrograms(other.data);
        if (online.data) setOnlineCourses(online.data as any); 
        if (free.data) setFreeCourses(free.data);
        if (plus.data) setZellPlus(plus.data);
        if (cast.data) setPodcasts(cast.data);

      } catch (err) {
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const renderSection = (title: string, icon: React.ReactNode, items: any[], type: 'video' | 'mixed' | 'simple' = 'simple', gridCols = 'lg:grid-cols-3') => {
      if (!items || items.length === 0) return null;

      return (
          <div className="mb-16">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="p-2 bg-white/5 rounded-lg text-white border border-white/10">
                      {icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                  <span className="ml-auto text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-zinc-400">{items.length} items</span>
              </div>
              
              <div className={`grid md:grid-cols-2 ${gridCols} gap-6`}>
                  {items.map((item, idx) => (
                      <div key={item.id || idx} className="glass-panel rounded-2xl overflow-hidden group hover:border-white/20 transition-all flex flex-col">
                          {/* Image/Video Preview */}
                          {(item.image_url || item.video_url) && (
                              <div className="relative aspect-video bg-black/40 border-b border-white/5 overflow-hidden">
                                  {item.image_url ? (
                                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                  ) : (
                                     <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                         {type === 'video' ? <Video size={32} /> : <ImageIcon size={32} />}
                                     </div>
                                  )}
                                  
                                  {/* Overlay for ID */}
                                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-sm">
                                      ID: {item.id}
                                  </div>
                              </div>
                          )}

                          <div className="p-5 flex-grow flex flex-col">
                              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                              {item.price && <p className="text-green-400 font-bold text-sm mb-2">{item.price}</p>}
                              
                              <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-grow">
                                  {item.description || "No description provided."}
                              </p>

                              <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-lg border border-white/10 transition-colors">
                                      {t.products.editBtn}
                                  </button>
                                  {item.video_url && (
                                      <a href={item.video_url} target="_blank" rel="noreferrer" className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 text-xs font-bold py-2 rounded-lg border border-red-500/20 transition-colors flex items-center justify-center gap-2">
                                          <PlayCircle size={12} /> {t.products.viewBtn}
                                      </a>
                                  )}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-zinc-900/50">
      <Section className="py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-3 flex items-center justify-center gap-3">
                <Package className="text-red-600" size={40} />
                {t.products.title}
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">{t.products.subtitle}</p>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-zinc-500" size={40} />
             </div>
        ) : (
            <>
                {/* 1. Mini Programs */}
                {renderSection(t.products.miniTitle, <Star size={20} className="text-yellow-500" />, miniPrograms, 'mixed')}
                
                {/* 2. Other Programs */}
                {renderSection(t.products.otherTitle, <Zap size={20} className="text-purple-500" />, otherPrograms, 'mixed')}
                
                {/* 3. Zell Plus Content */}
                {renderSection(t.products.plusTitle, <PlusSquare size={20} className="text-red-500" />, zellPlus, 'mixed')}
                
                {/* 4. Zell Podcast */}
                {renderSection(t.products.podcastTitle, <Mic size={20} className="text-blue-500" />, podcasts, 'simple')}

                {/* 5. Online Courses */}
                {renderSection(t.products.onlineTitle, <Video size={20} className="text-emerald-500" />, onlineCourses, 'video')}

                {/* 6. Free Courses */}
                {renderSection(t.products.freeTitle, <PlayCircle size={20} className="text-cyan-500" />, freeCourses, 'video')}
            </>
        )}
      </Section>
    </div>
  );
};

export default Products;
