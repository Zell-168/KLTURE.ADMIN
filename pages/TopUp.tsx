
import React, { useState, useEffect } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { Wallet, Search, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { CreditTransaction } from '../types';

interface SimpleUser {
    email: string;
    full_name: string;
}

const TopUp: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedEmail, setSelectedEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<CreditTransaction[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchRecentTopUps();
  }, []);

  const fetchUsers = async () => {
    try {
        // Fetch from 'registrations' table to match "All Users" page source
        const { data, error } = await supabase
            .from('registrations')
            .select('email, full_name')
            .order('full_name');
        
        if (error) throw error;

        // Dedup users by email
        const uniqueUsers = Array.from(new Map(data?.map(u => [u.email, u])).values());
        setUsers(uniqueUsers);
    } catch (err) {
        console.error("Error fetching users:", err);
    } finally {
        setLoading(false);
    }
  };

  const fetchRecentTopUps = async () => {
      try {
          const { data } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('type', 'topup')
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (data) setRecentTransactions(data as CreditTransaction[]);
      } catch (err) {
          console.error("Error fetching transactions", err);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);

      if (!user) {
          setMessage({ type: 'error', text: 'You must be logged in as admin.' });
          return;
      }
      if (!selectedEmail || !amount) {
          setMessage({ type: 'error', text: 'Please select a user and enter an amount.' });
          return;
      }

      setProcessing(true);

      try {
          const { error } = await supabase
            .from('credit_transactions')
            .insert([{
                user_email: selectedEmail,
                amount: parseFloat(amount),
                type: 'topup',
                note: note,
                created_by: user.email
            }]);

          if (error) throw error;

          setMessage({ type: 'success', text: t.topUp.successMsg });
          setAmount('');
          setNote('');
          fetchRecentTopUps();
      } catch (err: any) {
          console.error("Top up error:", err);
          setMessage({ type: 'error', text: err.message || 'Failed to process top up.' });
      } finally {
          setProcessing(false);
      }
  };

  const filteredUsers = users.filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-900/50">
      <Section className="py-8">
        <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <Wallet size={32} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{t.topUp.title}</h1>
            <p className="text-zinc-400">{t.topUp.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Top Up Form */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl">
                {message && (
                    <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-500/30' : 'bg-red-900/20 text-red-400 border border-red-500/30'}`}>
                        {message.type === 'success' ? <CheckCircle size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                        <p className="text-sm font-bold">{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">{t.topUp.selectUserLabel}</label>
                        <div className="relative">
                            <input 
                                type="text"
                                list="user-list"
                                placeholder={t.topUp.searchPlaceholder}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                                value={selectedEmail}
                                onChange={(e) => setSelectedEmail(e.target.value)}
                                autoComplete="off"
                            />
                            <datalist id="user-list">
                                {users.map(u => (
                                    <option key={u.email} value={u.email}>{u.full_name} ({u.email})</option>
                                ))}
                            </datalist>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                            {users.length} users loaded from database. Type to search or select from list.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">{t.topUp.amountLabel}</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                            <input 
                                type="number" 
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white font-mono focus:outline-none focus:border-green-500 transition-colors"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">{t.topUp.noteLabel}</label>
                        <input 
                            type="text" 
                            placeholder="Reason for top up (optional)"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing || loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : <Wallet size={20} />}
                        {t.topUp.submitBtn}
                    </button>
                </form>
            </div>

            {/* Recent History */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl bg-white/5">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ArrowRight size={20} className="text-zinc-500" />
                    {t.topUp.recentHistory}
                </h2>

                {recentTransactions.length > 0 ? (
                    <div className="space-y-4">
                        {recentTransactions.map(tx => (
                            <div key={tx.id} className="bg-black/40 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                                <div className="overflow-hidden">
                                    <p className="font-bold text-white text-sm truncate w-40 sm:w-auto" title={tx.user_email}>{tx.user_email}</p>
                                    <p className="text-xs text-zinc-500">{new Date(tx.created_at).toLocaleString()}</p>
                                    {tx.note && <p className="text-xs text-zinc-400 mt-1 italic">"{tx.note}"</p>}
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-green-400 text-lg">+{tx.amount}</p>
                                    <p className="text-[10px] text-zinc-600 uppercase font-bold">Top Up</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-zinc-500 italic">
                        No recent top ups found.
                    </div>
                )}
            </div>
        </div>
      </Section>
    </div>
  );
};

export default TopUp;
