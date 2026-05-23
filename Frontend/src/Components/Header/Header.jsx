import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [user, setuser] = useState(null);
  
  useEffect(() => {
    const localuser = localStorage.getItem('user');
    if (localuser) setuser(JSON.parse(localuser));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/80 text-white shadow-xl transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between py-4 px-8">
        
        {/* LOGO */}
        <NavLink to="/" className="flex items-center group space-x-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-30 blur group-hover:opacity-75 transition-all duration-500"></div>
            <img src="/logoicon.png" alt="Logo" className="relative w-10 h-auto transform group-hover:scale-105 transition-all duration-500" />
          </div>
          <span className="text-3xl font-extrabold font-outfit tracking-wider bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
            TAG
          </span>
        </NavLink>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex space-x-8 font-outfit">
          {[
            { to: "/", label: "Home" },
            { to: "/problems", label: "Problemset" },
            { to: "/discuss", label: "Discuss" },
            { to: "/join-interview", label: "Join Interview" },
            { to: "/host-interview", label: "Host Interview" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                relative text-[16px] font-medium tracking-wide transition-all duration-300 py-1.5 px-1
                ${isActive 
                  ? 'text-orange-400 font-semibold' 
                  : 'text-slate-300 hover:text-orange-400'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* PROFILE/AUTH SECTION */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Link to={'/profile'} className="group">
              <div className="flex items-center space-x-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-full py-1.5 pl-2 pr-4 transition-all duration-300 shadow-inner">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 group-hover:opacity-100 blur transition duration-300"></div>
                  <img 
                    src={user.avatar || '/defaultuser.png'} 
                    alt="User" 
                    className="relative w-8 h-8 rounded-full object-cover border border-slate-700/60"
                  />
                </div>
                <span className="text-[15px] font-medium font-outfit text-slate-300 group-hover:text-white transition-all">
                  {user.username || 'user'}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-4 font-outfit">
              <NavLink 
                to="/login" 
                className="text-[15px] font-medium text-slate-300 hover:text-white transition py-2 px-4 rounded-xl"
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="text-[15px] font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all duration-300 py-2 px-5 rounded-xl"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
