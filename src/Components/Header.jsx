import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Droplets, LogIn, Bell, ChevronDown, ShieldAlert, MessageSquareText, UserCircle, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import socket from '../Services/socket';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menu, setMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [complaintDropdown, setComplaintDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const loadUser = () => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser && storedUser._id) {
            socket.emit("register", storedUser._id);
        }
        setUser(storedUser);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        loadUser();
        window.addEventListener("userChanged", loadUser);

        const socketInstance = io("http://localhost:5000");
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if (storedUser?._id) {
            socketInstance.emit("register", storedUser._id);
            socketInstance.on("notification", (data) => {
                setNotifications(prev => [data, ...prev]);
                data.type === 'success' ? toast.success(data.message) : toast.error(data.message);
            });
        }

        return () => {
            window.removeEventListener("userChanged", loadUser);
            socketInstance.disconnect();
        };
    }, []);

    // Close all dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".nav-dropdown-container")) {
                setProfileDropdown(false);
                setComplaintDropdown(false);
                setShowNotifications(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogOut = () => {
        sessionStorage.clear();
        window.dispatchEvent(new Event("userChanged"));
        navigate('/login');
        setUser(null);
    };

    const navLink = [
        { name: 'Home', path: '/' },
        { name: 'Donors', path: '/donors' },
        { name: 'All Requests', path: '/all-request' },
        { name: 'Request Blood', path: '/request' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200 py-3' 
            : 'bg-red-600 py-5'}`}>
            
            <div className='max-w-7xl mx-auto px-6 flex justify-between items-center'>
                
                {/* LOGO */}
                <Link className='flex items-center gap-2 group' to={'/'}>
                    <div className={`p-2 rounded-xl transition-all duration-300 ${scrolled ? 'bg-red-600' : 'bg-white'}`}>
                        <Droplets className={`${scrolled ? 'text-white' : 'text-red-600'} w-6 h-6`} />
                    </div>
                    <span className={`text-2xl font-black tracking-tighter transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                        Insta<span className={scrolled ? 'text-red-600' : 'text-red-200'}>Blood</span>
                    </span>
                </Link>

                {/* DESKTOP MENU */}
                <div className='hidden md:flex items-center gap-1'>
                    <div className='flex items-center gap-1 mr-4'>
                        {navLink.map((val) => (
                            <Link
                                key={val.name}
                                to={val.path}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    isActive(val.path) 
                                    ? (scrolled ? 'bg-red-50 text-red-600' : 'bg-white/20 text-white') 
                                    : (scrolled ? 'text-slate-600 hover:bg-slate-50' : 'text-red-50 hover:bg-white/10')
                                }`}
                            >
                                {val.name}
                            </Link>
                        ))}

                        {/* COMPLAINTS DROPDOWN */}
                        {user && (
                            <div className="relative nav-dropdown-container">
                                <button 
                                    onClick={() => setComplaintDropdown(!complaintDropdown)}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                        complaintDropdown || location.pathname.includes('complaint')
                                        ? (scrolled ? 'bg-red-50 text-red-600' : 'bg-white/20 text-white')
                                        : (scrolled ? 'text-slate-600 hover:bg-slate-50' : 'text-red-50 hover:bg-white/10')
                                    }`}
                                >
                                    Complaints <ChevronDown size={14} className={`transition-transform ${complaintDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {complaintDropdown && (
                                    <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                                        <Link to="/my-complaints" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                            <ShieldAlert size={18} className="text-orange-500" /> My Complaints
                                        </Link>
                                        <Link to="/donor-complaints" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                            <MessageSquareText size={18} className="text-red-500" /> Complaints Against Me
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={`h-8 w-[1px] mx-2 ${scrolled ? 'bg-slate-200' : 'bg-red-400/50'}`}></div>

                    {/* ACTIONS (Notifications & Profile) */}
                    <div className='flex items-center gap-3 ml-2'>
                        {user ? (
                            <>
                                {/* NOTIFICATIONS */}
                                <div className="relative nav-dropdown-container">
                                    <button 
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className={`p-2 rounded-full transition-all ${scrolled ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-white'}`}
                                    >
                                        <Bell size={20} />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 border-2 border-white w-3 h-3 rounded-full animate-pulse"></span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
                                            <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                                                <span className="font-bold text-slate-800">Notifications</span>
                                                <button onClick={() => setNotifications([])} className="text-xs font-bold text-red-600 hover:underline">Clear All</button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center text-slate-400 text-sm">No new updates</div>
                                                ) : (
                                                    notifications.map((n, i) => (
                                                        <div key={i} className="p-4 border-b hover:bg-slate-50 transition-colors">
                                                            <p className="text-sm font-medium text-slate-700">{n.message}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* PROFILE */}
                                <div className="relative nav-dropdown-container">
                                    <button onClick={() => setProfileDropdown(!profileDropdown)} className="flex items-center gap-2 group pl-1">
                                        <img 
                                            src={user.profile || "src/assets/userprofile.avif"} 
                                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-red-500 transition-all shadow-sm" 
                                        />
                                    </button>

                                    {profileDropdown && (
                                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in slide-in-from-right-5">
                                            <div className="px-4 py-3 border-b mb-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                                                <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                                            </div>
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
                                                <UserCircle size={18} /> My Profile
                                            </Link>
                                            <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                                                <LogOut size={18} /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                                scrolled ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-red-600 hover:bg-red-50'
                            }`}>
                                <LogIn size={18} /> Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* MOBILE BUTTON */}
                <button onClick={() => setMenu(!menu)} className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                    {menu ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* MOBILE MENU (Briefly optimized) */}
            {menu && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl py-4 px-6 flex flex-col gap-2">
                    {navLink.map((val) => (
                        <Link key={val.name} to={val.path} onClick={() => setMenu(false)} className="py-3 font-bold text-slate-700 border-b border-slate-50">
                            {val.name}
                        </Link>
                    ))}
                    {user && (
                        <>
                            <Link to="/my-complaints" onClick={() => setMenu(false)} className="py-3 font-bold text-slate-700 border-b border-slate-50">My Complaints</Link>
                            <Link to="/donor-complaints" onClick={() => setMenu(false)} className="py-3 font-bold text-slate-700 border-b border-slate-50">Donor Complaints</Link>
                            <button onClick={handleLogOut} className="py-3 font-bold text-red-600 text-left uppercase text-xs tracking-widest mt-2">Sign Out</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Header;