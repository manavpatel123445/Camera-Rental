import { useRef, useState, useEffect } from 'react';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../../logo.png';
import ProfileModal from './ProfileModal';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  onSidebarToggle: () => void;
}

const user = {
  name: 'Guest',
  role: 'Merchant Captain',
  avatar: '', // Use FaUserCircle if no avatar
};

const AdminNavbar = ({ onSidebarToggle }: AdminNavbarProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('adminProfile');
    dispatch(logout());
    toast.success('Logged out successfully');
    setDropdownOpen(false);
    navigate('/admin/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 bg-[var(--secondary-bg)] flex items-center px-4 shadow border-b border-[var(--border-color)] z-50 text-[var(--text-primary)]">
        
        <div className="flex items-center gap-3">
          <button
            className="text-[var(--text-secondary)] text-2xl focus:outline-none mr-2 md:mr-4 hover:text-[var(--text-primary)] transition"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <span className="text-[var(--text-primary)] font-bold text-xl tracking-wide select-none">
          <img src={logo} alt="LensRentals" className="w-30 h-20" />
          </span>
        </div>
        
        {/* Spacer to push right elements to the end */}
        <div className="flex-1"></div>
        
        {/* Profile dropdown */}
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
              <button 
                onClick={handleProfileClick}
                className="flex items-center w-full gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] transition text-sm"
              >
                <FaUserCircle className="text-base" /> View Profile
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition text-sm"
              >
                <FaSignOutAlt className="text-base" /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
    </>
  );
};

export default AdminNavbar; 