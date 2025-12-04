
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { Link } from 'react-router-dom';
import { Users, DollarSign, BookOpen, TrendingUp, Bell, ShoppingBag, Calendar, Filter, X, Lock, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CreditTransaction } from '../types';

const Home: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
      totalUsers: 0,
      totalRevenue: 0, // From topup
      productSales: 0, // From spend
      totalPrograms: 0,
      recentSales: [] as CreditTransaction[]
  });

  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
      start: '',
      end: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
        // 1. Prepare Queries
        // Change: Query 'registrations' table for user count to match All Users page
        let userQuery = supabase.from('registrations').select('*', { count: 'exact' });
        
        // Transaction aggregates
        let txQuery = supabase.from('credit_transactions').select('amount, type, created_at');

        // Change: Fetch recent 'spend' transactions for the Sales Dashboard
        let salesQuery = supabase
            .from('credit_transactions')
            .select('*')
            .eq('type', 'spend')
            .order('created_at', { ascending: false })
            .limit(10);

        // Apply Date Filters
        if (dateRange.start) {
            userQuery = userQuery.gte('created_at', dateRange.start);
            txQuery = txQuery.gte('created_at', dateRange.start);
            salesQuery = salesQuery.gte('created_at', dateRange.start);
        }
        if (dateRange.end) {
            // Ensure we cover the entire end day
            const endOfDay = `${dateRange.end} 23:59:59`;
            userQuery = userQuery.lte('created_at', endOfDay);
            txQuery = txQuery.lte('created_at', endOfDay);
            salesQuery = salesQuery.lte('created_at', endOfDay);
        }

        // 2. Execute Data Fetching
        // Users
        const { count: userCount } = await userQuery;

        // Sales Table Data
        const { data: salesData } = await salesQuery;

        // Programs (Inventory count is typically snapshot-based, not historical, so we keep it static)
        const { count: miniCount } = await supabase.from('programs_mini').select('*', { count: 'exact' });
        const { count: otherCount } = await supabase.from('programs_other').select('*', { count: 'exact' });
        const { count: onlineCount } = await supabase.from('courses_online').select('*', { count: 'exact' });

        // Transactions Aggregates
        const { data: txData } = await txQuery;
        
        // 3. Calculate Metrics
        // Total Revenue = Sum of 'topup' type transactions
        const revenue = txData
            ?.filter(t => t.type === 'topup')
            .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        // Product Sale = Sum of absolute value of 'spend' type transactions
        const sales = txData
            ?.filter(t => t.type === 'spend')
            .reduce((acc, curr) => acc + Math.abs(Number(curr.amount)), 0) || 0;

        setStats({
            totalUsers: userCount || 0,
            totalRevenue: revenue,
            productSales: sales,
            totalPrograms: (miniCount || 0) + (otherCount || 0) + (onlineCount || 0),
            recentSales: salesData || []
        });
    };
    fetchStats();
  }, [dateRange]); // Refetch when dateRange changes

  const clearFilter = () => {
      setDateRange({ start: '', end: '' });
  };

  return (
    <div className="min-h-screen bg-zinc-900/50">
      <Section className="py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-3xl font-black text-white">Dashboard Overview</h1>
                <p className="text-zinc-400">Welcome back, {user?.full_name || 'Guest'}. Here is your system status.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
                 <button 
                    onClick={() => setShowFilter(!showFilter)}
                    className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${showFilter || dateRange.start || dateRange.end ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}
                 >
                    <Calendar size={18} />
                    <span className="font-bold text-sm">Timeline</span>
                 </button>
                 
                 <button className="p-3 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white">
                    <Bell size={20} />
                 </button>
                 <Link to="/contact" className="px-5 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg flex items-center gap-2">
                    + New Registration
                 </Link>
            </div>
        </div>

        {/* Timeline Filter Panel */}
        {showFilter && (
            <div className="mb-8 glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-4 items-end sm:items-center animate-fade-in">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold mr-2">
                    <Filter size={16} /> Filter Report:
                </div>
                <div className="flex-grow grid grid-cols-2 gap-4 w-full sm:w-auto">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Start Date</label>
                        <input 
                            type="date" 
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 outline-none"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">End Date</label>
                        <input 
                            type="date" 
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 outline-none"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>
                {(dateRange.start || dateRange.end) && (
                    <button 
                        onClick={clearFilter}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Clear Dates"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
            {/* Total Users */}
            <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 bg-zinc-950/50">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium mb-1 truncate">
                    {dateRange.start || dateRange.end ? 'New Users' : 'Total Users'}
                </h3>
                {user ? (
                   <p className="text-2xl md:text-3xl font-black text-white truncate">{stats.totalUsers}</p>
                ) : (
                   <div className="flex items-center gap-1 md:gap-2 text-zinc-500 mt-2 h-8 md:h-9">
                      <Lock className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm font-bold">Login</span>
                   </div>
                )}
                <p className="text-[10px] md:text-xs text-zinc-500 mt-1 truncate">From registrations db</p>
            </div>

            {/* Total Revenue (Topup) */}
            <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 bg-zinc-950/50">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="p-2 md:p-3 bg-green-500/10 rounded-xl text-green-500">
                        <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium mb-1 truncate">Total Revenue</h3>
                {user ? (
                   <p className="text-2xl md:text-3xl font-black text-white truncate">${stats.totalRevenue.toLocaleString()}</p>
                ) : (
                   <div className="flex items-center gap-1 md:gap-2 text-zinc-500 mt-2 h-8 md:h-9">
                      <Lock className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm font-bold">Login</span>
                   </div>
                )}
                <p className="text-[10px] md:text-xs text-zinc-500 mt-1 truncate">From wallet topups</p>
            </div>

            {/* Product Sales (Spend) */}
            <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 bg-zinc-950/50">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="p-2 md:p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium mb-1 truncate">Product Sale</h3>
                {user ? (
                    <p className="text-2xl md:text-3xl font-black text-white truncate">${stats.productSales.toLocaleString()}</p>
                ) : (
                   <div className="flex items-center gap-1 md:gap-2 text-zinc-500 mt-2 h-8 md:h-9">
                      <Lock className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm font-bold">Login</span>
                   </div>
                )}
                <p className="text-[10px] md:text-xs text-zinc-500 mt-1 truncate">From course purchases</p>
            </div>

            {/* Active Programs */}
            <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 bg-zinc-950/50">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl text-purple-500">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="hidden md:inline text-zinc-500 text-xs font-bold bg-zinc-800 px-2 py-1 rounded">Active</span>
                </div>
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium mb-1 truncate">Programs Active</h3>
                {user ? (
                    <p className="text-2xl md:text-3xl font-black text-white truncate">{stats.totalPrograms}</p>
                ) : (
                   <div className="flex items-center gap-1 md:gap-2 text-zinc-500 mt-2 h-8 md:h-9">
                      <Lock className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm font-bold">Login</span>
                   </div>
                )}
                <p className="text-[10px] md:text-xs text-zinc-500 mt-1 truncate md:hidden">Status: Active</p>
            </div>
        </div>

        {/* Recent Product Sales Table (Replaces Recent Registrations) */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <CreditCard size={20} className="text-yellow-500" />
                    {dateRange.start || dateRange.end ? 'Sales in Period' : 'Recent Product Sales'}
                </h3>
            </div>
            
            {user ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-white/5 text-zinc-300 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Item / Reference</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.recentSales.length > 0 ? (
                                stats.recentSales.map((tx, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{tx.user_email}</td>
                                        <td className="px-6 py-4">
                                            {tx.note ? (
                                                <span className="text-zinc-300">{tx.note}</span>
                                            ) : (
                                                <span className="text-zinc-600 italic">No description</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-red-400 font-bold font-mono">
                                                -${Math.abs(Number(tx.amount)).toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center italic">No sales activity found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-black/20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-zinc-500">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Access Restricted</h3>
                    <p className="text-zinc-500 text-sm">Please login to view sales data</p>
                </div>
            )}
        </div>

      </Section>
    </div>
  );
};

export default Home;
