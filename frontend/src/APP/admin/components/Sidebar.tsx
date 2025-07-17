import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--secondary-bg)] shadow-xl rounded-r-3xl flex flex-col py-8 px-4 z-40 border-r border-[var(--border-color)] transition-colors duration-300 text-[var(--text-primary)]">
      <div className="mb-8 flex items-center gap-2">
        <span className="font-bold text-2xl text-[var(--text-primary)]">Admin Panel</span>
      </div>
      <nav className="flex flex-col gap-4">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium text-[var(--text-primary)] ${isActive ? 'bg-[var(--border-color)]' : 'hover:bg-[var(--sidebar-hover)]'}` }>
          <FaTachometerAlt className="text-lg" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium text-[var(--text-primary)] ${isActive ? 'bg-[var(--border-color)]' : 'hover:bg-[var(--sidebar-hover)]'}` }>
          <FaBoxOpen className="text-lg" />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium text-[var(--text-primary)] ${isActive ? 'bg-[var(--border-color)]' : 'hover:bg-[var(--sidebar-hover)]'}` }>
          <FaClipboardList className="text-lg" />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium text-[var(--text-primary)] ${isActive ? 'bg-[var(--border-color)]' : 'hover:bg-[var(--sidebar-hover)]'}` }>
          <FaUsers className="text-lg" />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/profile" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition font-medium text-[var(--text-primary)] ${isActive ? 'bg-[var(--border-color)]' : 'hover:bg-[var(--sidebar-hover)]'}` }>
          <FaUserCircle className="text-lg" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar; 