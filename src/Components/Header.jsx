import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Droplets, User, LogIn } from 'lucide-react';
import socket from '../Services/socket';



const Header = () => {
    const navigate=useNavigate()

    const [menu, setMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const [user,setUser]=useState(null)

    // change header on scrolling
useEffect(() => {
    const loadUser = () => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
          if (storedUser && storedUser._id) {
    socket.emit("register",storedUser._id);
  }
        setUser(storedUser);
    };

    loadUser();

   
    window.addEventListener("userChanged", loadUser);

    return () => {
        window.removeEventListener("userChanged", loadUser);
    };
}, []);

    const handleLogOut=()=>{
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
                            Blood
                            <span className='text-red-300'> Finder</span>

                        </span>

                    </Link>
{/* Desktop navigation */}
<div className='hidden md:flex items-center gap-8'>
    <div className='flex items-center gap-6'>
        {navLink.map((val) => (
            <Link
                key={val.name}
                to={val.path}
                className={`text-sm font-medium transition-colors hover:text-red-300 ${
                    isActive(val.path) ? 'text-white border-b-2 border-white' : 'text-red-100'
                }`}
            >
                {val.name}
            </Link>
        ))}
    </div>

    <div className="h-6 w-[1px] bg-red-400/50 mx-2"></div>

    <div className='flex items-center gap-4'>
        {user ? (
            <div className="flex items-center gap-4">
                {/* Profile Section */}
                <div className="flex items-center gap-2 text-white">
                    <img
                        src={user.profile || "src/assets/userprofile.avif"}
                        alt="dp"
                        className="w-9 h-9 rounded-full object-cover border-2 border-white"
                    />
                    <span className="font-semibold">{user.name}</span>
                </div>
                {/* Logout Button */}
                <button
                    onClick={handleLogOut}
                    className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
                >
                    Logout
                </button>
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