import React, { useState } from 'react';

import { BarChart3, Users, ShieldAlert, Menu, X, LogOut, Bell,MessageSquareQuote  } from "lucide-react";
import { useNavigate } from 'react-router-dom';



const AdminLayout = ({ children }) => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications,setShowNotifications]=useState(false)
  const navigate=useNavigate()



  const navItems = [

    { name: 'Dashboard', icon: <BarChart3 size={20}/>, path: '/admin' },

    { name: 'Approvals', icon: <ShieldAlert size={20}/>, path: '/admin-approval' },

    { name: 'Donors', icon: <Users size={20}/>, path: '/admin-donors' },

    { name: 'Complaints', icon: <MessageSquareQuote  size={20}/>, path: '/admin-complaints' },

  ];



  return (

    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* Sidebar - Desktop */}

      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-white sticky top-0 h-screen transition-all duration-300">

        <div className="p-8">

          <div className="flex items-center gap-3 mb-10">

            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20">

              <span className="font-black text-xl">B</span>

            </div>

            <h1 className="text-xl font-black tracking-tight">InstaBlood <span className="text-rose-500">.</span></h1>

          </div>



          <nav className="space-y-2">

            {navItems.map((item) => (

              <a

                key={item.name}

                href={item.path}

                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group

                  ${window.location.pathname === item.path ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}

              >

                {item.icon}

                <span className="font-semibold">{item.name}</span>

              </a>

            ))}

          </nav>

        </div>

       

        <div className="mt-auto p-8 border-t border-slate-800">

           <button className="flex items-center gap-4 text-slate-400 hover:text-rose-400 transition-colors">

             <LogOut size={20}/> <span className="font-bold">Logout</span>

           </button>

        </div>

      </aside>



      {/* Main Content Area */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}

        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">

          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">

            <Menu />

          </button>

         

          <div className="hidden md:block">

             <h2 className="text-slate-500 font-medium">Welcome back, <span className="text-slate-900 font-bold text-lg">Admin</span></h2>

          </div>



          <div className="flex items-center gap-4">

            <button onClick={()=>setShowNotifications(!showNotifications)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors relative">

               <Bell size={22}/>

               <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>

            </button>

            <div onClick={()=>navigate('/admin-profile')} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">

               <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="profile" />

            </div>

          </div>

        </header>
         {showNotifications && (
  <div className="absolute right-20 mt-5 top-20 w-80 bg-white shadow-xl rounded-2xl p-4 z-50 border">
    <h3 className="font-bold mb-3">Notifications</h3>

    <div className="space-y-2 text-sm">
      <div className="p-2 bg-slate-100 rounded-lg">New donor registered</div>
      <div className="p-2 bg-slate-100 rounded-lg">Request approved</div>
      <div className="p-2 bg-slate-100 rounded-lg">Complaint received</div>
    </div>

    <button 
      onClick={() => setShowNotifications(false)}
      className="mt-3 text-xs text-rose-500"
    >
      Close
    </button>
  </div>
)}


        <main className="p-4 md:p-8 animate-in fade-in duration-500">

          {children}

        </main>

      </div>



      {/* Mobile Menu Overlay */}

      {isMobileMenuOpen && (

        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm lg:hidden p-6">

          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-white"><X size={32}/></button>

          <div className="mt-20 space-y-6 text-center">

            {navItems.map(item => (

              <a key={item.name} href={item.path} className="block text-2xl font-bold text-white hover:text-rose-500">{item.name}</a>

            ))}

          </div>

        </div>

      )}

    </div>

  );

};



export default AdminLayout;