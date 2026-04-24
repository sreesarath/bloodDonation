import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import socket from '../Services/socket';


const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
        socket.emit("join", user._id);
    }
}, []);

  // Using an illustrative high-quality photo related to community/security
  const illustrationImg = "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&q=80&w=800";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA] px-6 py-12 relative overflow-hidden">
        
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-40 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40 -ml-20 -mb-20" />

        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden relative z-10">
          
          {/* LEFT SIDE: Visual Content */}
          <div className="relative hidden lg:block overflow-hidden bg-slate-900">
            <img 
              src={illustrationImg} 
              alt="Community" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            
            <div className="absolute bottom-12 left-12 right-12">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <ShieldCheck className="text-rose-400 mb-4" size={32} />
                <h3 className="text-white text-2xl font-black mb-2 tracking-tight">Your Safety Matters</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  We verify every donor and recipient to ensure a secure and trustworthy life-saving community.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Action Content */}
          <div className="p-8 md:p-16 flex flex-col justify-center text-center lg:text-left">
            <div className="mb-10 inline-flex items-center justify-center lg:justify-start">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center relative">
                <div className="absolute inset-0 bg-rose-200 rounded-2xl animate-pulse opacity-30" />
                <Lock className="text-rose-600 relative z-10" size={28} />
              </div>
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-none">
              One Step Away <br className="hidden md:block" /> From Saving Lives.
            </h2>
            
            <p className="text-slate-500 font-bold mb-10 leading-relaxed max-w-sm mx-auto lg:mx-0">
              Please sign in to access the donor directory and connect with heroes in your area.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 active:scale-95 flex items-center justify-center gap-3"
              >
                Sign In to Continue
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2 text-slate-400 font-black hover:text-slate-800 transition-colors flex items-center justify-center lg:justify-start gap-2 text-xs uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Back to Homepage
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                Verified Secured Access
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedPage;