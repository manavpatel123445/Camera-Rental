import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface UserAnalytics {
  dailyRegistrations: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    count: number;
  }>;
  statusDistribution: Array<{
    _id: string;
    count: number;
  }>;
  topUsers: Array<{
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const UserAnalyticsChart: React.FC = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAnalytics();
  }, [period]);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try different token names
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      const authToken = adminToken || token;
      
      console.log('UserAnalyticsChart: Fetching with token:', authToken ? 'Token exists' : 'No token');
      
      const response = await fetch(`https://camera-rental-ndr0.onrender.com/api/admin/analytics/users?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('UserAnalyticsChart: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('UserAnalyticsChart: Data received:', data);
        setAnalytics(data);
      } else {
        const errorData = await response.json();
        console.error('UserAnalyticsChart: Error response:', errorData);
        setError(`Failed to fetch user analytics: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('UserAnalyticsChart: Network error:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateObj: { year: number; month: number; day: number }) => {
    return `${dateObj.month}/${dateObj.day}/${dateObj.year}`;
  };

  const formatRevenue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold">Error Loading User Analytics</h3>
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchUserAnalytics}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-500">No user analytics data available</p>
      </div>
    );
  }

  // Prepare data for charts
  const registrationData = analytics.dailyRegistrations.map(item => ({
    date: formatDate(item._id),
    registrations: item.count
  }));

  const statusData = analytics.statusDistribution
    .filter(item => item._id && typeof item._id === 'string') // Filter out null/undefined _id values
    .map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count
    }));

  const topUsersData = analytics.topUsers.slice(0, 8).map(user => ({
    name: user.name && user.name.length > 15 ? user.name.substring(0, 15) + '...' : (user.name || 'Unknown User'),
    orders: user.orderCount,
    spent: user.totalSpent
  }));

  // Check if we have any meaningful data
  const hasRegistrationData = registrationData.some(item => item.registrations > 0);
  const hasStatusData = statusData.some(item => item.value > 0);
  const hasTopUsersData = topUsersData.length > 0;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">User Analytics</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Registration Trends Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Registration Trends</h3>
        {hasRegistrationData ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Registrations']} />
              <Area type="monotone" dataKey="registrations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No registration data available for the selected period</p>
          </div>
        )}
      </div>

      {/* User Status Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Status Distribution</h3>
        {hasStatusData ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Users']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No user status data available</p>
          </div>
        )}
      </div>

      {/* Top Users */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Users by Orders</h3>
        {hasTopUsersData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsersData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [value, 'Orders']} />
              <Bar dataKey="orders" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No user order data available for the selected period</p>
          </div>
        )}
      </div>

      {/* Top Users Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Users Details</h3>
        {hasTopUsersData ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Orders</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topUsers.map((user, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 font-semibold">{user.orderCount}</td>
                    <td className="py-3 px-4 font-semibold">{formatRevenue(user.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No user order data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAnalyticsChart; 