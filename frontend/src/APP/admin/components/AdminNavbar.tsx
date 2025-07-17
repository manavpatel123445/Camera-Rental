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
    <nav className="fixed top-0 left-0 w-full h-16 bg-[var(--secondary-bg)] flex items-center px-4 shadow border-b border-[var(--border-color)] z-50 text-[var(--text-primary)]">
      {/* Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          className="text-[var(--text-secondary)] text-2xl focus:outline-none mr-2 md:mr-4 hover:text-[var(--text-primary)] transition"
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <span className="text-[var(--text-primary)] font-bold text-xl tracking-wide select-none">Camera Rental</span>
      </div>
      {/* Search bar */}
      <div className="flex-1 flex justify-center md:justify-start ml-4">
        <div className="relative w-64 max-w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded bg-[var(--primary-bg)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:bg-[var(--secondary-bg)] border border-[var(--border-color)] focus:border-[var(--border-color)] transition"
            disabled
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-lg" />
        </div>
      </div>
      {/* Right icons */}
      <button className="text-[var(--text-secondary)] text-xl hover:text-[var(--text-primary)] transition" aria-label="Notifications">
        <FaBell />
      </button>
      <div className="relative" ref={dropdownRef}>
        <button
          className="text-[var(--text-secondary)] text-xl hover:text-[var(--text-primary)] transition rounded-full focus:outline-none"
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
          <div className="absolute right-0 mt-2 w-64 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-xl shadow-lg z-50 py-2 animate-fade-in text-[var(--text-primary)]">
            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)]">
              <div className="bg-[var(--primary-bg)] rounded-full w-10 h-10 flex items-center justify-center text-2xl text-[var(--text-secondary)]">
                <FaUserCircle />
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]">{user.name}</div>
                <div className="text-xs text-blue-500 font-medium">{user.role}</div>
              </div>
            </div>
            {/* Menu items */}
            <button className="flex items-center w-full gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] transition text-sm">
              <FaUniversalAccess className="text-base" /> Accessibility
            </button>
            <button className="flex items-center w-full gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] transition text-sm">
              <FaSlidersH className="text-base" /> Preferences
            </button>
            <span className="flex items-center gap-2 text-sm"><FaMoon className="text-base" /> Dark mode</span>
            <button
              className="w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 bg-[var(--border-color)]"
              aria-label="Toggle dark mode"
              disabled
            >
              <span className="w-4 h-4 bg-[var(--secondary-bg)] rounded-full shadow transform transition-transform duration-200" />
            </button>
            <button className="flex items-center w-full gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] transition text-sm">
              <FaCog className="text-base" /> Account Settings
            </button>
            <button className="flex items-center w-full gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] transition text-sm">
              <FaQuestionCircle className="text-base" /> Help Center
            </button>
            <button className="flex items-center w-full gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] transition text-sm">
              <FaSignInAlt className="text-base" /> Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar; 