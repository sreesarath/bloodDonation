import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight,Phone, Droplets, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { RegisterApi } from '../Services/AllApi';



const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone:''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate()
 

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("Registering...", data);
    const {name,email,password,phone}=data
  if (!name || !email || !password || !phone) {
    toast.info("Please Fill The Form!!!")
  }else{
    const res=await RegisterApi(data)
    console.log(res);
    if (res.status === 200 || res.status === 201) {
      toast.success("Register Sussefull !!!")
      setData({name:"",email:"",password:"",phone:""})
      sessionStorage.setItem('token',JSON.stringify(res.data))
      navigate('/login')

    }
    else{
      toast.error("User Already Exists !!!")
    }
    
  }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      {/* 🎨 Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] px-6"
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-rose-600 rounded-[2rem] text-white shadow-xl shadow-rose-200 mb-4">
            <Droplets size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 font-medium mt-2">Join the network and start saving lives.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input 
                  name="name" 
                  onChange={(e)=>setData({...data,name:e.target.value})}
                  value={data.name}
                  placeholder="Enter your name" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-inner" 
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input 
                  name="email" 
                  type="email"
                  value={data.email}
                  onChange={(e)=>setData({...data,email:e.target.value})}
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-inner" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  value={data.password}
                  onChange={(e)=>setData({...data,password:e.target.value})} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-inner" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  <ShieldCheck size={20} />
                </button>
              </div>
              {/* Password Strength Mockup */}
              {data.password.length > 0 && (
                <div className="flex gap-1 mt-2 px-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= 2 ? 'bg-rose-500' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              )}
            </div>
            {/* Mobile */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input 
                  name="phone" 
                  type="phone"
                  value={data.phone}
                  onChange={(e)=>setData({...data,phone:e.target.value})}
                  placeholder="8546987412" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all shadow-inner" 
                />
              </div>
            </div>

            <button className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-[0.98] mt-4">
              Create My Account
              <ArrowRight size={20} />
            </button>

            {/* Alternative Login Options */}
       

           
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 font-semibold">
          Already a member? <Link to="/login" className="text-rose-600 font-black hover:underline underline-offset-4">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;