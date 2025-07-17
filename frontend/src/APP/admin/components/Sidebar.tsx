import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl rounded-r-3xl flex flex-col py-8 px-4 z-40 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="mb-8 flex items-center gap-2">
        <span className="font-bold text-2xl text-slate-700 dark:text-white">Admin Panel</span>
      </div>
      <nav className="flex flex-col gap-4">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium ${isActive ? 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'}` }>
          <FaTachometerAlt className="text-lg" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium ${isActive ? 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'}` }>
          <FaBoxOpen className="text-lg" />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium ${isActive ? 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'}` }>
          <FaClipboardList className="text-lg" />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium ${isActive ? 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'}` }>
          <FaUsers className="text-lg" />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/profile" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium ${isActive ? 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'}` }>
          <FaUserCircle className="text-lg" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar; 