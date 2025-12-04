
import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { Loader2, Search, MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react';

const Community: React.FC = () => {
  const { t } = useLang();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all profiles from 'registrations' table (legacy/historical view)
        const { data: userData, error } = await supabase
          .from('registrations')
          .select('id, full_name, email, phone_number, program, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Deduplicate by Email for the "Users List"
        const uniqueUsers = Array.from(new Map(userData?.map(u => [u.email, u])).values()) as User[];
        setUsers(uniqueUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone_number?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-zinc-900/50">
      <Section className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <div>
                <h1 className="text-2xl font-black text-white">All Users Database</h1>
                <p className="text-zinc-400 text-sm">Source: Registration History</p>
                <p className="text-zinc-500 text-xs">Total Records: {users.length}</p>
             </div>
             <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by name, email, or phone..." 
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-500" size={40} />
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-white/5 text-zinc-200 font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Last Program</th>
                    <th className="px-6 py-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xs border border-white/10">
                                {u.full_name ? u.full_name.substring(0,2).toUpperCase() : 'NA'}
                            </div>
                            <span className="font-bold text-white">{u.full_name || 'Unknown User'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 text-xs text-zinc-300">
                                <Mail size={12} className="text-zinc-500" /> {u.email}
                             </div>
                             {u.phone_number && (
                                <div className="flex items-center gap-2 text-xs text-zinc-300">
                                    <Phone size={12} className="text-zinc-500" /> {u.phone_number}
                                </div>
                             )}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs text-zinc-300 inline-block max-w-[200px] truncate">
                            {u.program || 'No Program'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                         <div className="flex items-center gap-2">
                             <Calendar size={12} />
                             {new Date(u.created_at).toLocaleDateString()}
                         </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                      <tr>
                          <td colSpan={4} className="text-center py-12 text-zinc-500">
                              No users found matching "{searchTerm}"
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-white/5 px-6 py-3 border-t border-white/10 text-xs text-zinc-500 flex justify-between">
                <span>Showing {filteredUsers.length} users</span>
                <span>Database: Registrations</span>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};

export default Community;
