import { useState } from 'react';
import Sidebar from './Sidebar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen bg-[var(--primary-bg)] flex transition-colors duration-300">
      {/* Navbar at the top */}
      <AdminNavbar onSidebarToggle={() => setSidebarOpen((open) => !open)} />
      {/* Sidebar with slide animation, below navbar */}
      <div
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}
        style={{ width: 256 }}
      >
        <Sidebar />
        {/* Arrow button to close sidebar */}
        <button
          className="absolute -right-4 top-8 bg-white dark:bg-gray-800 shadow rounded-full p-1 border border-slate-200 dark:border-gray-700 z-50 hover:bg-slate-100 dark:hover:bg-gray-700 transition"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          style={{ display: sidebarOpen ? 'block' : 'none' }}
        >
          <FaChevronLeft className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>
      {/* Overlay with blur when sidebar is open and not pinned */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          style={{ top: '4rem' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Arrow button to open sidebar */}
      {!sidebarOpen && (
        <button
          className="fixed left-2 top-24 z-50 bg-white dark:bg-gray-800 shadow rounded-full p-1 border border-slate-200 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-700 transition"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FaChevronRight className="text-gray-700 dark:text-gray-200" />
        </button>
      )}
      {/* Main content, below navbar, with sidebar margin */}
      <div className={`flex-1 transition-all duration-300 pt-16 ${sidebarOpen ? 'ml-64' : 'ml-4'} p-4 md:p-8`}>{children}</div>
    </div>
  );
};

export default AdminLayout; 