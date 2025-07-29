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
  LineChart,
  Line
} from 'recharts';

interface CartAnalytics {
  mostSavedProducts: Array<{
    name: string;
    category: string;
    pricePerDay: number;
    saveCount: number;
    image?: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CartAnalyticsChart: React.FC = () => {
  const [analytics, setAnalytics] = useState<CartAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for cart metrics (since backend cart tracking is not implemented yet)
  const cartMetrics = {
    conversionRate: 65,
    averageCartValue: 125.50,
    abandonedCarts: 23,
    completedCarts: 67
  };

  const cartTrends = [
    { day: 'Mon', additions: 45, removals: 12, conversions: 8 },
    { day: 'Tue', additions: 52, removals: 15, conversions: 12 },
    { day: 'Wed', additions: 38, removals: 8, conversions: 15 },
    { day: 'Thu', additions: 61, removals: 18, conversions: 22 },
    { day: 'Fri', additions: 48, removals: 14, conversions: 18 },
    { day: 'Sat', additions: 55, removals: 16, conversions: 25 },
    { day: 'Sun', additions: 42, removals: 11, conversions: 20 }
  ];

  useEffect(() => {
    fetchCartAnalytics();
  }, []);

  const fetchCartAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3000/api/admin/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics({ mostSavedProducts: data.mostSavedProducts || [] });
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch cart analytics: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
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
          <h3 className="text-lg font-semibold">Error Loading Cart Analytics</h3>
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchCartAnalytics}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare data for charts
  const cartConversionData = [
    { name: 'Converted', value: cartMetrics.completedCarts },
    { name: 'Abandoned', value: cartMetrics.abandonedCarts }
  ];

  const savedProductsData = analytics?.mostSavedProducts.slice(0, 6).map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    saves: item.saveCount,
    price: item.pricePerDay
  })) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Cart Analytics</h2>

      {/* Cart Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{cartMetrics.conversionRate}%</div>
          <div className="text-gray-600">Conversion Rate</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{formatRevenue(cartMetrics.averageCartValue)}</div>
          <div className="text-gray-600">Average Cart Value</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{cartMetrics.abandonedCarts}</div>
          <div className="text-gray-600">Abandoned Carts</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{cartMetrics.completedCarts}</div>
          <div className="text-gray-600">Completed Carts</div>
        </div>
      </div>

      {/* Cart Conversion Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cart Conversion</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={cartConversionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {cartConversionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Carts']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Cart Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cart Activity Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cartTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="additions" stroke="#8884d8" name="Additions" />
            <Line type="monotone" dataKey="removals" stroke="#ff7300" name="Removals" />
            <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Most Saved Products */}
      {analytics && analytics.mostSavedProducts.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Saved Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savedProductsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value) => [value, 'Saves']} />
              <Bar dataKey="saves" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Most Saved Products Table */}
      {analytics && analytics.mostSavedProducts.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Products Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price/Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Save Count</th>
                </tr>
              </thead>
              <tbody>
                {analytics.mostSavedProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 capitalize">{product.category}</td>
                    <td className="py-3 px-4 font-semibold">{formatRevenue(product.pricePerDay)}</td>
                    <td className="py-3 px-4">{product.saveCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartAnalyticsChart; 