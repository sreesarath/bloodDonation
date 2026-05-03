import React, { useState } from 'react'
import {  Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoginApi } from '../Services/AllApi'



const Login = () => {
  const navigate=useNavigate()
    const [data, setData] = useState({
      
      email: '',
      password: ''
      
    });
  const handleLogin=async(e)=>{
  e.preventDefault()
  const {email,password}=data
  if (!email || !password) {
    toast.info("please fill the form!!!")
  }
  else{
    const res=await LoginApi(data)
    console.log(res);
    if (res.status === 200 || res.status === 201) {
     sessionStorage.setItem('token', res.data.token); 
    
    // 2. Save the USER info as a JSON string
    sessionStorage.setItem('user', JSON.stringify(res.data.user));
    window.dispatchEvent(new Event("userChanged"));
      toast.success("Login Successfull !!!")
      setData({email:"",password:""})
      console.log(res.data);
      
      if (res?.data?.user?.role==="admin") {
        navigate('/admin')
      }else{
        navigate('/')
      }
    }
    else{
      toast.error("Invalid Email or Password")
    }
  }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Branding/Visual */}
        <div className="hidden md:flex flex-col justify-center w-1/2 bg-red-600 p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-red-100 leading-relaxed">
            Your contribution saves lives. Log in to manage your donations or request assistance.
          </p>
          <div className="mt-8 pt-8 border-t border-red-500 text-sm">
            Quick Fact: One donation can save up to three lives.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input onChange={(e)=>setData({...data,email:e.target.value})} value={data.email} type="email" placeholder="Email" className="w-full px-4 py-4 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all" />
            <input onChange={(e)=>setData({...data,password:e.target.value})} value={data.password} type="password" placeholder="Password" className="w-full px-4 py-4 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all" />
            
            <button type='submit' className="w-full py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all">
              Sign In
            </button>
          </form>
          <p className="mt-8 text-center text-gray-500">
            Don't have an account? <Link to={'/register'}><span className="text-red-600 font-bold cursor-pointer">Register</span></Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login