import { useRef, useState, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaSearch, FaMoon, FaSun, FaCog, FaSignOutAlt, FaSignInAlt, FaQuestionCircle, FaUniversalAccess, FaSlidersH } from 'react-icons/fa';
import { useTheme } from './ThemeContext';

interface AdminNavbarProps {
  onSidebarToggle: () => void;
}

const user = {
  name: 'Guest',
  role: 'Merchant Captain',
  avatar: '', // Use FaUserCircle if no avatar
};

const AdminNavbar = ({ onSidebarToggle }: AdminNavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 flex items-center px-4 shadow border-b border-gray-200 dark:border-gray-800 z-50">
      {/* Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          className="text-gray-600 dark:text-gray-200 text-2xl focus:outline-none mr-2 md:mr-4 hover:text-gray-900 dark:hover:text-white transition"
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <span className="text-gray-800 dark:text-white font-bold text-xl tracking-wide select-none">Camera Rental</span>
      </div>
      {/* Search bar */}
      <div className="flex-1 flex justify-center md:justify-start ml-4">
        <div className="relative w-64 max-w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-700 border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 transition"
            disabled
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 text-lg" />
        </div>
      </div>
      {/* Right icons */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="text-gray-600 dark:text-gray-200 text-xl hover:text-gray-900 dark:hover:text-white transition" aria-label="Notifications">
          <FaBell />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            className="text-gray-600 dark:text-gray-200 text-xl hover:text-gray-900 dark:hover:text-white transition rounded-full focus:outline-none"
            aria-label="Profile"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <FaUserCircle />
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 py-2 animate-fade-in">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl text-gray-500 dark:text-gray-300">
                  <FaUserCircle />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">{user.name}</div>
                  <div className="text-xs text-blue-500 font-medium">{user.role}</div>
                </div>
              </div>
              {/* Menu items */}
              <button className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm">
                <FaUniversalAccess className="text-base" /> Accessibility
              </button>
              <button className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm">
                <FaSlidersH className="text-base" /> Preferences
              </button>
              {/* Dark mode toggle */}
              <div className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-200">
                <span className="flex items-center gap-2 text-sm"><FaMoon className="text-base" /> Dark mode</span>
                <button
                  className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-5' : ''}`}
                  />
                </button>
              </div>
              <button className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm">
                <FaCog className="text-base" /> Account Settings
              </button>
              <button className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm">
                <FaQuestionCircle className="text-base" /> Help Center
              </button>
              <button className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm">
                <FaSignInAlt className="text-base" /> Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 