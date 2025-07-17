import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../auth/authSlice';
const Navbar = () => {
  const admin = useSelector((state: any) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {}
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/admin/login');
  };

  return (
    <nav className="bg-slate-800 text-white px-4 md:px-8 py-4 flex items-center justify-between gap-4 relative border-b border-slate-200 shadow-sm">
      <button
        className="md:hidden mr-2"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>
      {/* Main nav links (hidden on mobile) */}
      <div className="hidden md:flex flex-wrap gap-4 md:gap-6 items-center">
        <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/admin/orders" className="hover:underline">Order List</Link>
        <Link to="/admin/addproduct" className="hover:underline">Product Management</Link>
        <Link to="/admin/products" className="hover:underline">Product details </Link>
      </div>
      <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
        <Link to="/admin/profile" className="flex items-center gap-2 bg-slate-700 px-2 md:px-3 py-1 rounded-full hover:bg-slate-600 transition-colors text-sm md:text-base">
          <FontAwesomeIcon icon={faUserCircle} size="lg" />
          <span className="font-semibold hidden sm:inline truncate max-w-[100px] md:max-w-xs">{admin?.username}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="bg-slate-500 hover:bg-slate-600 text-white px-3 md:px-4 py-2 rounded shadow text-sm md:text-base"
        >
          Logout
        </button>
      </div>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex">
          <div className="bg-slate-800 text-white w-64 p-6 flex flex-col gap-6 h-full shadow-lg animate-slide-in-left border-r border-slate-200">
            <button
              className="self-end mb-6"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <Link to="/admin/dashboard" className="hover:underline" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
            <Link to="/admin/orders" className="hover:underline" onClick={() => setSidebarOpen(false)}>Order List</Link>
            <Link to="/admin/products" className="hover:underline" onClick={() => setSidebarOpen(false)}>Product Management</Link>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navbar; 