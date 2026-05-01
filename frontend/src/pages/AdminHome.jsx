import React, { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, Users, Car, Zap, CheckCircle, 
  Clock, IndianRupee, ShieldCheck, ArrowRight,
  Filter, Calendar, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useLanguage } from '../context/LanguageContext';

const AdminHome = ({ trips, drivers, onNewBooking }) => {
  const { lang } = useLanguage();
  
  const t = {
    EN: {
      totalBookings: 'Total Bookings',
      activeRides: 'Active Rides',
      totalRevenue: 'Total Revenue',
      completed: 'Completed',
      todayBookings: "Today's Bookings",
      todayRevenue: "Today's Revenue",
      totalDrivers: 'Total Drivers',
      securityLevel: 'Security Level',
      max: 'MAX',
      manifests: 'Manifests',
      live: 'Live',
      gross: 'Gross',
      success: 'Success',
      new: 'New',
      daily: 'Daily',
      operatives: 'Operatives',
      encrypted: 'Encrypted',
      trends: 'Trends',
      dailyManifests: 'Daily manifests (Last 7 Days)',
      last7Days: 'Last 7 Days',
      monthly: 'Monthly',
      statusMix: 'Mix',
      status: 'Status',
      mixSub: 'Booking distribution',
      revenueAnalytics: 'Analytics',
      revenue: 'Revenue',
      earningsSub: 'Earnings from verified leads',
      performers: 'Performers',
      top: 'Top',
      activeOperatives: 'Most active field operatives',
      noActiveDrivers: 'No Active Drivers',
      missions: 'Missions',
      recentActivity: 'Activity',
      recent: 'Recent',
      latestEntries: 'Latest system entries',
      viewAll: 'View All',
      customer: 'Customer',
      route: 'Route'
    },
    TA: {
      totalBookings: 'மொத்த முன்பதிவுகள்',
      activeRides: 'செயலில் உள்ள பயணங்கள்',
      totalRevenue: 'மொத்த வருவாய்',
      completed: 'முடிந்தவை',
      todayBookings: 'இன்றைய முன்பதிவுகள்',
      todayRevenue: 'இன்றைய வருவாய்',
      totalDrivers: 'மொத்த ஓட்டுநர்கள்',
      securityLevel: 'பாதுகாப்பு நிலை',
      max: 'அதிகபட்சம்',
      manifests: 'பதிவுகள்',
      live: 'நேரலை',
      gross: 'மொத்தம்',
      success: 'வெற்றி',
      new: 'புதியது',
      daily: 'தினசரி',
      operatives: 'இயக்குபவர்கள்',
      encrypted: 'மறைக்குறியாக்கப்பட்டது',
      trends: 'போக்குகள்',
      dailyManifests: 'தினசரி பதிவுகள் (கடந்த 7 நாட்கள்)',
      last7Days: 'கடந்த 7 நாட்கள்',
      monthly: 'மாதாந்திர',
      statusMix: 'கலவை',
      status: 'நிலை',
      mixSub: 'முன்பதிவு விநியோகம்',
      revenueAnalytics: 'பகுப்பாய்வு',
      revenue: 'வருவாய்',
      earningsSub: 'சரிபார்க்கப்பட்ட லீட்களின் வருவாய்',
      performers: 'செயல்பாட்டாளர்கள்',
      top: 'சிறந்த',
      activeOperatives: 'மிகவும் சுறுசுறுப்பான களப்பணியாளர்கள்',
      noActiveDrivers: 'செயலில் உள்ள ஓட்டுநர்கள் இல்லை',
      missions: 'பணிகள்',
      recentActivity: 'செயல்பாடு',
      recent: 'சமீபத்திய',
      latestEntries: 'சமீபத்திய சிஸ்டம் உள்ளீடுகள்',
      viewAll: 'அனைத்தையும் பார்',
      customer: 'வாடிக்கையாளர்',
      route: 'வழி'
    }
  };
  // Helper to get relative date
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const d = new Date(dateStr);
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  // Analytics Logic
  const stats = useMemo(() => {
    const safeTrips = trips || [];
    const safeDrivers = drivers || [];
    
    const totalBookings = safeTrips.length;
    const completedRides = safeTrips.filter(t => t.status === 'COMPLETED').length;
    const activeRides = safeTrips.filter(t => t.status === 'STARTED').length;
    const paidLeads = safeTrips.filter(t => t.details_unlocked);
    const totalRevenue = paidLeads.reduce((sum, t) => sum + (t.lead_fee || 0), 0);
    
    const todayBookings = safeTrips.filter(t => isToday(t.bookingDateTime)).length;
    const todayRevenue = safeTrips
      .filter(t => isToday(t.bookingDateTime) && t.details_unlocked)
      .reduce((sum, t) => sum + (t.lead_fee || 0), 0);
    
    const totalDrivers = safeDrivers.length;
    const onlineDrivers = safeDrivers.filter(d => d.isOnline).length;

    return {
      totalBookings, completedRides, activeRides, totalRevenue,
      todayBookings, todayRevenue, totalDrivers, onlineDrivers
    };
  }, [trips, drivers]);

  // Chart Data Preparation
  const bookingTrends = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = trips.filter(t => new Date(t.bookingDateTime).toDateString() === d.toDateString()).length;
      const revenue = trips
        .filter(t => new Date(t.bookingDateTime).toDateString() === d.toDateString() && t.details_unlocked)
        .reduce((sum, t) => sum + (t.lead_fee || 0), 0);
      return { name: dateStr, bookings: count, revenue: revenue, date: d };
    }).reverse();
    return last7Days;
  }, [trips]);

  const statusDistribution = [
    { name: 'Created', value: trips.filter(t => t.status === 'CREATED').length, color: '#94A3B8' },
    { name: 'Accepted', value: trips.filter(t => t.status === 'ACCEPTED').length, color: '#FB923C' },
    { name: 'Paid', value: trips.filter(t => t.status === 'PAID' || t.status === 'START_OTP_SENT').length, color: '#3B82F6' },
    { name: 'Started', value: trips.filter(t => t.status === 'STARTED').length, color: '#22C55E' },
    { name: 'Completed', value: trips.filter(t => t.status === 'COMPLETED').length, color: '#0B1E3F' },
  ].filter(s => s.value > 0);

  const topDrivers = useMemo(() => {
    const driverStats = drivers.map(d => {
      const count = trips.filter(t => t.accepted_driver_id === d._id).length;
      return { ...d, tripCount: count };
    }).sort((a, b) => b.tripCount - a.tripCount).slice(0, 5);
    return driverStats;
  }, [trips, drivers]);

  const StatCard = ({ title, value, icon: Icon, sub, color }) => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3" /> 12%
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-[#0B1E3F]">{value}</p>
        <p className="text-[10px] font-bold text-slate-500">{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <StatCard title={t[lang].totalBookings} value={stats.totalBookings} icon={Car} sub={t[lang].manifests} color="bg-blue-50 text-blue-600" />
        <StatCard title={t[lang].activeRides} value={stats.activeRides} icon={Zap} sub={t[lang].live} color="bg-orange-50 text-orange-600" />
        <StatCard title={t[lang].totalRevenue} value={`₹${stats.totalRevenue.toLocaleString()}`} icon={IndianRupee} sub={t[lang].gross} color="bg-green-50 text-green-600" />
        <StatCard title={t[lang].completed} value={stats.completedRides} icon={CheckCircle} sub={t[lang].success} color="bg-indigo-50 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <StatCard title={t[lang].todayBookings} value={stats.todayBookings} icon={Calendar} sub={t[lang].new} color="bg-slate-50 text-slate-600" />
        <StatCard title={t[lang].todayRevenue} value={`₹${stats.todayRevenue.toLocaleString()}`} icon={TrendingUp} sub={t[lang].daily} color="bg-emerald-50 text-emerald-600" />
        <StatCard title={t[lang].totalDrivers} value={stats.totalDrivers} icon={Users} sub={t[lang].operatives} color="bg-purple-50 text-purple-600" />
        <StatCard title={t[lang].securityLevel} value={t[lang].max} icon={ShieldCheck} sub={t[lang].encrypted} color="bg-slate-900 text-white" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">{t[lang].totalBookings.split(' ')[1]} <span className="text-blue-600">{t[lang].trends}</span></h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t[lang].dailyManifests}</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
               <button className="px-3 py-1.5 text-[10px] font-bold bg-white shadow-sm rounded-lg">{t[lang].last7Days}</button>
               <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400">{t[lang].monthly}</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                  labelStyle={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-1">{t[lang].status} <span className="text-blue-600">{t[lang].statusMix}</span></h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">{t[lang].mixSub}</p>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">{t[lang].revenue} <span className="text-green-600">{t[lang].revenueAnalytics}</span></h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t[lang].earningsSub}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5 text-green-600" /></div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Drivers Activity */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">{t[lang].top} <span className="text-purple-600">{t[lang].performers}</span></h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t[lang].activeOperatives}</p>
            </div>
            <Users className="w-5 h-5 text-slate-300" />
          </div>
          <div className="space-y-4">
            {topDrivers.length > 0 ? topDrivers.map((driver, i) => (
              <div key={driver._id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs">{i+1}</div>
                  <div>
                    <p className="text-sm font-bold text-[#0B1E3F]">{driver.name}</p>
                    <p className="text-[10px] font-medium text-slate-400">{driver.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-blue-600">{driver.tripCount}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{t[lang].missions}</p>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">{t[lang].noActiveDrivers}</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">{t[lang].recent} <span className="text-blue-600">{t[lang].recentActivity}</span></h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].latestEntries}</p>
          </div>
          <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">{t[lang].viewAll} <ArrowRight className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t[lang].customer}</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t[lang].route}</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t[lang].status}</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter text-right">{t[lang].revenue}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {trips.slice(0, 5).map(trip => (
                <tr key={trip._id} className="hover:bg-slate-50/30 transition-all">
                  <td className="px-8 py-4">
                    <p className="text-xs font-bold text-[#0B1E3F]">{trip.customerName}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{trip.customerPhone}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs font-bold text-slate-600">{trip.pickupLocation} → {trip.dropLocation}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[8px] font-bold uppercase tracking-widest">{trip.status}</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <p className="text-xs font-bold text-green-600">
                      {trip.details_unlocked ? `₹${(trip.lead_fee || 0).toLocaleString()}` : '₹0'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
