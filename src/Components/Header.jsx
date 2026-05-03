import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Droplets, User, LogIn, Bell } from 'lucide-react';
import socket from '../Services/socket';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';



const Header = () => {
    const navigate = useNavigate()

    const [menu, setMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [dropdown, setDropdown] = useState(false)
     const [notifications, setNotifications] = useState([]);

    // change header on scrolling
            const loadUser = () => {
           

            const storedUser = JSON.parse(sessionStorage.getItem("user"));


            if (storedUser && storedUser._id) {
                socket.emit("register", storedUser._id);
            }
            setUser(storedUser);
        };

    useEffect(() => {

const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => {
        loadUser();
        window.addEventListener("userChanged", loadUser);

        // Socket connection
        const socket = io("http://localhost:5000");
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if (storedUser?._id) {
            socket.emit("register", storedUser._id);
            socket.on("notification", (data) => {
                setNotifications(prev => [data, ...prev]);
                if (data.type === 'success') toast.success(data.message);
                else toast.error(data.message);
            });
        }

        return () => {
            window.removeEventListener("userChanged", loadUser);
            socket.disconnect();
        };
    }, []);
    const toggleDropdown = () => setDropdown(!dropdown);
    const handleLogOut = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')

        window.dispatchEvent(new Event("userChanged"));
        navigate('/login')
        setUser(null)
    }
    const navLink = [
        { name: 'Home', path: '/' },
        { name: 'Donors', path: '/donors' },
        { name: 'ALL Requests', path: '/all-request' },
        { name: 'Request Blood', path: '/request' },
    ]
    const isActive = (path) => location.pathname === path


    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-red-700/90 backdrop-blur-md shadow-lg py-2'
                : 'bg-red-600 py-4'
                }`}>
                <div className='max-w-7xl mx-auto px-6 flex justify-between items-center'>
                    {/* logo section */}
                    <Link className='flex items-center gap-2 group' to={'/'}>
                        <div className='bg-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform'>
                            <Droplets className='text-red-600 w-6 h-6' />
                        </div>
                        <span className='text-3xl font-extrabold tracking-tight text-white'>
                            Insta
                            <span className='text-red-300'>Blood</span>

                        </span>

                    </Link>
                    {/* Desktop navigation */}
                    <div className='hidden md:flex items-center gap-8'>
                        <div className='flex items-center gap-6'>
                            {navLink.map((val) => (
                                <Link
                                    key={val.name}
                                    to={val.path}
                                    className={`text-sm font-medium transition-colors hover:text-red-300 ${isActive(val.path) ? 'text-white border-b-2 border-white' : 'text-red-100'
                                        }`}
                                >
                                    {val.name}
                                </Link>
                            ))}
                        </div>

                        <div className="h-6 w-[1px] bg-red-400/50 mx-2"></div>

                        <div className='flex items-center gap-4'>
                            {user && (
                            <div className="relative mr-2">
                                <Bell className="text-white cursor-pointer" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                        )}
                            {user ? (
                                <div className="relative">
                                    <button onClick={toggleDropdown} className="flex items-center gap-2 text-white hover:opacity-80 transition">
                                        <img src={user.profile || "src/assets/userprofile.avif"} className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                                        <span className="font-semibold hidden md:block">{user.name}</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdown && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-slate-100">
                                            <Link to="/profile" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium">My Profile</Link>
                                            <button onClick={handleLogOut} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium">Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        className='text-white hover:text-red-200 text-sm font-semibold flex items-center gap-2'
                                        to={'/login'}
                                    >
                                        <LogIn size={18} />Login
                                    </Link>
                                    <Link to={'/register'}>
                                        <button className='bg-white text-red-600 hover:bg-red-50 px-5 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95'>
                                            Register Now
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    {/* mobile */}
                    <div className='md:hidden'>
                        <button
                            onClick={() => setMenu(!menu)}
                            className='p-2 text-white hover:bg-red-500 rounded-lg transition-colors'>
                            {menu ? <X size={28} /> : <Menu size={28} />}
                        </button>

                    </div>

                </div>
                {/* new mobile menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-red-700 ${menu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className='px-6 py-6 flex flex-col gap-4 border-t border-red-500/30'>
                        {
                            navLink.map((val) => (
                                <Link
                                    key={val.name}
                                    to={val.path}
                                    className={`text-lg font-semibold ${isActive(val.path) ? 'text-white' : 'text-red-200'}`}>
                                    {val.name}
                                </Link>
                            ))
                        }
                        <hr className="border-red-500" />
                        <div className='flex items-center gap-4'>

                            {user ? (
                                <>
                                    {/* Profile */}
                                    <div className="flex items-center gap-2 text-white">
                                        <img
                                            src={user.profile || "src/assets/userprofile.avif"}
                                            alt="dp"
                                            className="w-9 h-9 rounded-full object-cover border-2 border-white"
                                        />
                                        <span className="font-semibold">{user.name}</span>


                                    </div>
                                    <div className="relative">
                                        <Bell className="cursor-pointer" />
                                        {notifications.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* Logout */}
                                    <button
                                        onClick={handleLogOut}
                                        className="bg-white text-red-600 px-4 py-2 rounded-xl text-sm font-bold"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        className='text-white hover:text-red-200 text-sm font-semibold flex items-center gap-2'
                                        to={'/login'}
                                    >
                                        <LogIn size={18} />Login
                                    </Link>

                                    <Link to={'/register'}>
                                        <button className='bg-white text-red-600 px-5 py-2 rounded-xl font-bold text-sm'>
                                            Register Now
                                        </button>
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            </nav>


        </>
    );
};

export default Header;