import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, ArrowRight, Phone, Droplets, 
  ShieldCheck, CheckCircle2, Send, RefreshCcw 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { RegisterApi, sendOtpApi, VerfifyOtpApi } from '../Services/AllApi';

const Register = () => {
  const [data, setData] = useState({ name: '', email: '', password: '', phone: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!data.email) return toast.info("Please enter your email first");
    
    try {
      setIsSendingOtp(true);
      const res = await sendOtpApi({ email: data.email });
      if (res.status === 200) {
        setOtpSent(true);
        toast.success("OTP dispatched to your inbox");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtpHandler = async () => {
    if (otp.length < 4) return toast.warn("Enter a valid OTP");
    const res = await VerfifyOtpApi({ email: data.email, otp });

    if (res.data.success) {
      setVerified(true);
      toast.success("Identity Verified Successfully");
    } else {
      toast.error("Invalid verification code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) return toast.error("Please complete email verification");
    
    const { name, email, password, phone } = data;
    if (!name || !email || !password || !phone) {
      toast.info("All fields are mandatory");
    } else {
      const res = await RegisterApi(data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Welcome to the Lifesaver Network!");
        navigate('/login');
      } else {
        toast.error("Account already exists with this email");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* 🎨 Premium Background Decorations */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-br from-rose-100 to-transparent rounded-full blur-[120px] opacity-70"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-100 to-transparent rounded-full blur-[120px] opacity-70"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[500px] px-6 py-10"
      >
        {/* Branding Section */}
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="inline-flex p-5 bg-gradient-to-tr from-rose-600 to-red-500 rounded-[2.2rem] text-white shadow-2xl shadow-rose-200 mb-6"
          >
            <Droplets size={38} fill="currentColor" />
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Join Us</h1>
          <p className="text-slate-500 font-medium">Become a hero in someone's story today.</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl p-1 w-full rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white/50">
          <div className="bg-white p-8 md:p-10 rounded-[3.2rem] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-4">Legal Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                  <input
                    name="name"
                    required
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    value={data.name}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Email Section with Inline Verification */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-4 flex justify-between">
                  Email Address
                  {verified && <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                  <input
                    name="email"
                    type="email"
                    disabled={verified}
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className={`w-full pl-12 pr-28 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-sm ${verified ? 'bg-emerald-50/50 text-emerald-700' : 'focus:border-rose-500 focus:bg-white'}`}
                  />
                  {!verified && (
                    <button 
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                      {isSendingOtp ? <RefreshCcw size={14} className="animate-spin" /> : otpSent ? "Resend" : "Send OTP"}
                    </button>
                  )}
                </div>
              </div>

              {/* OTP Input - Animated Reveal */}
              <AnimatePresence>
                {otpSent && !verified && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder='Enter 6-digit OTP' 
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-center font-black tracking-[0.5em] text-rose-600 outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={verifyOtpHandler}
                        className="bg-rose-600 text-white px-6 rounded-2xl font-bold hover:bg-rose-700 transition-all flex items-center gap-2"
                      >
                        Verify <ShieldCheck size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-4">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    {showPassword ? <CheckCircle2 size={20} /> : <ShieldCheck size={20} />}
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-4">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                  <input
                    name="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-5 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 transition-all mt-6 shadow-xl ${verified ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Create My Account
                <ArrowRight size={22} />
              </motion.button>
            </form>
          </div>
        </div>

        <p className="text-center mt-10 text-slate-500 font-bold">
          Already a lifesaver? <Link to="/login" className="text-rose-600 font-black hover:text-rose-700 border-b-2 border-rose-100 hover:border-rose-600 transition-all pb-1 ml-1">Sign in instead</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;