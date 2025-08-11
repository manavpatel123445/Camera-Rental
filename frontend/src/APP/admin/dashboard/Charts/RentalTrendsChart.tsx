/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
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
  Area,
  ComposedChart
} from 'recharts';

interface DashboardAnalytics {
  users: {
    total: number;
    active: number;
    disabled: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  products: {
    total: number;
    cameras: number;
    lenses: number;
    accessories: number;
  };
  trends: {
    monthlyOrders: Array<{
      _id: {
        year: number;
        month: number;
      };
      count: number;
      totalRevenue: number;
    }>;
    monthlyRegistrations: Array<{
      _id: {
        year: number;
        month: number;
      };
      count: number;
    }>;
  };
  popularProducts: Array<{
    name: string;
    category: string;
    orderCount: number;
    totalRevenue: number;
    image?: string;
  }>;
  mostSavedProducts: Array<{
    name: string;
    category: string;
    pricePerDay: number;
    saveCount: number;
    image?: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const RentalTrendsChart: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      console.log('Fetching analytics with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('https://camera-rental-ndr0.onrender.com/api/admin/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analytics data received:', data);
        setAnalytics(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch dashboard analytics:', errorData);
        setError(`Failed to fetch analytics: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatMonth = (month: number) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
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
          <h3 className="text-lg font-semibold">Error Loading Analytics</h3>
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchDashboardAnalytics}
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
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  // Prepare data for chxarts
  const monthlyOrderData = analytics.trends.monthlyOrders.map(item => ({
    month: `${formatMonth(item._id.month)} ${item._id.year}`,
    orders: item.count,
    revenue: item.totalRevenue
  }));

  const monthlyRegistrationData = analytics.trends.monthlyRegistrations.map(item => ({
    month: `${formatMonth(item._id.month)} ${item._id.year}`,
    registrations: item.count
  }));

  const userStatusData = [
    { name: 'Active', value: analytics.users.active },
    { name: 'Disabled', value: analytics.users.disabled }
  ];

  const orderStatusData = [
    { name: 'Pending', value: analytics.orders.pending },
    { name: 'Completed', value: analytics.orders.completed },
    { name: 'Cancelled', value: analytics.orders.cancelled }
  ];

  const productCategoryData = [
    { name: 'Cameras', value: analytics.products.cameras },
    { name: 'Lenses', value: analytics.products.lenses },
    { name: 'Accessories', value: analytics.products.accessories }
  ];

  const popularProductsData = analytics.popularProducts.slice(0, 6).map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    orders: item.orderCount,
    revenue: item.totalRevenue
  }));

  // Create line chart data for popular products trend
  const popularProductsTrendData = analytics.popularProducts.slice(0, 8).map((product, index) => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    orders: product.orderCount,
    revenue: product.totalRevenue,
    trend: Math.floor(Math.random() * 20) + 10 // Mock trend data
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Rental Trends & Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{analytics.users.total}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{analytics.orders.total}</div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{analytics.products.total}</div>
          <div className="text-gray-600">Total Products</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            ${analytics.trends.monthlyOrders.reduce((sum: number, item: any) => sum + item.totalRevenue, 0).toFixed(2)}
          </div>
          <div className="text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={monthlyOrderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'Revenue' ? formatRevenue(Number(value)) : value,
                name
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* User Registration Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Registration Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRegistrationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Registrations']} />
            <Area type="monotone" dataKey="registrations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={userStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {userStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Users']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Orders']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Product Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={productCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {productCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Products']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Popular Products - Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Popular Products Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={popularProductsTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'Revenue' ? formatRevenue(Number(value)) : value,
                name
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#8884d8" 
              strokeWidth={3}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#82ca9d" 
              strokeWidth={3}
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#82ca9d', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Most Popular Products - Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Popular Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={popularProductsData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip formatter={(value) => [value, 'Orders']} />
            <Bar dataKey="orders" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Popular Products Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Products Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Orders</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.popularProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 capitalize">{product.category}</td>
                  <td className="py-3 px-4 font-semibold">{product.orderCount}</td>
                  <td className="py-3 px-4 font-semibold">{formatRevenue(product.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentalTrendsChart;
