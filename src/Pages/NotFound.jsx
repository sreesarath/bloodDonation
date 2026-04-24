import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Droplet, ArrowRight, CornerDownLeft } from 'lucide-react';
import Header from '../Components/Header';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-36 pb-20 flex flex-col items-center justify-center text-center">
        
        {/* --- 💔 VISUAL MISMATCH Section --- */}
        <div className="relative mb-20">
          {/* Animated Shattered Heart Metaphor */}
          <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
            {/* The Mismatch 'X' */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="bg-white/90 backdrop-blur-xl p-5 rounded-full shadow-2xl shadow-rose-200 border border-white">
                <div className="text-8xl font-black text-rose-600 leading-none">?</div>
              </div>
            </motion.div>

            {/* Pulsating 'Mismatch' Glow */}
            <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-rose-50 rounded-full blur-[80px]"
            />
          </div>

          {/* Contextual Header */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-black text-slate-950 mb-4 tracking-tighter"
          >
            We Couldn’t <br className="md:hidden" /> Find a Match.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 font-bold max-w-lg mx-auto leading-relaxed"
          >
            We just scanned the entire network, but the path you're looking for seems to be a mismatch. The page has been moved or never existed.
          </motion.p>
        </div>

        {/* --- 🚀 HELPFUL ACTIONS Section --- */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-3 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row gap-4 items-center"
        >
          {/* Action 1: Re-Search */}
          <button 
            onClick={() => navigate('/donors')}
            className="flex items-center gap-3 w-full md:w-auto py-5 px-10 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Search size={20} />
            Search Donor Directory
            <ArrowRight size={18} className="text-slate-400" />
          </button>
          
          {/* Action 2: Safest Option */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full md:w-auto py-5 px-10 bg-slate-50 text-slate-600 rounded-[2rem] font-bold hover:bg-white hover:text-slate-800 transition-all border border-slate-100"
          >
            <CornerDownLeft size={16} />
            Back to Homepage
          </button>
        </motion.div>

        {/* --- 🏜️ DECORATIVE Section --- */}
        <p className="mt-16 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] max-w-sm mx-auto">
          One moment later can be too late. Please use the search to reconnect with heroes nearby.
        </p>
      </main>
    </div>
  );
};

export default NotFound;