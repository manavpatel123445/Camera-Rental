import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../APP/store';

interface NavLink {
  label: string;
  href: string;
}

interface CommonNavbarProps {
  navLinks?: NavLink[];
  showRentNow?: boolean;
  showSearch?: boolean;
  className?: string;
}

const CommonNavbar: React.FC<CommonNavbarProps> = ({
  navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Cameras', href: '/cameras' },
    { label: 'Lenses', href: '/lenses' },
    { label: 'Accessories', href: '/accessories' },
    { label: 'Support', href: '/support' },
  ],
  showRentNow = true,
  showSearch = true,
  className = '',
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state: RootState) => state.userAuth.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const handleStorage = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Logged out successfully!');
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  return (
    <nav className={`flex items-center justify-between px-8 py-4 bg-[#181622] ${className}`}>
      <span className="text-2xl font-bold tracking-tight text-white cursor-pointer" onClick={() => window.location.href = '/'}>
        LensRentals
      </span>
      <div className="flex gap-8 items-center">
        {navLinks.map(link => (
          <Link key={link.href} to={link.href} className="hover:text-purple-400 transition text-white">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        {showSearch && (
          <input
            type="text"
            placeholder="Search"
            className="bg-[#232136] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
          />
        )}
        {showRentNow && (
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg">Rent Now</Button>
        )}
        {isLoggedIn ? (
          <Button
            className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
        {user && (
          <Link to="/profile">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center ml-2 cursor-pointer overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000/${user.avatar}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-lg text-white">P</span>
              )}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default CommonNavbar;