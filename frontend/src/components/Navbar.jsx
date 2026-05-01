import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Globe, User, LayoutDashboard, Command } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-3xl z-[100] sticky top-0">
      <div className="max-w-[1400px] mx-auto px-10 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-5 group">
          <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center transition-all duration-500 shadow-2xl shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-3">
            <Globe className="w-7 h-7 text-white" />
          </div>

          <div>
            <p className="text-2xl font-black tracking-tighter text-white leading-none">
              VANDI <span className="text-blue-500">GO</span>
            </p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1.5">Operational Network</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-8">
            {['Fleet', 'Ops', 'Analytics'].map((item) => (
              <button key={item} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full rounded-full" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 pl-8 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-white tracking-tight leading-none uppercase">{user.name}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {user.role === 'Admin' ? 'System Admin' : 'Field Operative'}
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-red-400 hover:border-red-400/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
