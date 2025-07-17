

import { useSelector } from 'react-redux';
import AdminLayout from '../components/AdminLayout';

const Dashboard = () => {
  const admin = useSelector((state: any) => state.auth.user);
  
  
  
  return (
    <AdminLayout>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Admin Dashboard</h1>
      {admin && (
        <div className="mb-6">
          <div className="text-base md:text-lg">Welcome, <span className="font-semibold">{admin.username}</span></div>
          <div className="text-gray-600 text-sm md:text-base">Email: {admin.email}</div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white/80 rounded-lg shadow p-4 md:p-6">Stats Widget (e.g. Users, Orders)</div>
        <div className="bg-white/80 rounded-lg shadow p-4 md:p-6">Charts (e.g. Rentals, Revenue)</div>
        <div className="bg-white/80 rounded-lg shadow p-4 md:p-6">Recent Activity</div>
      </div>
      <div className="bg-white/80 rounded-lg shadow p-4 md:p-6">More dashboard content here...</div>
    </AdminLayout>
  );
};

export default Dashboard;