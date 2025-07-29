

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

import OrdersChart from './Charts/OrdersChart';
import RentalTrendsChart from './Charts/RentalTrendsChart';
import UserAnalyticsChart from './Charts/UserAnalyticsChart';
import CartAnalyticsChart from './Charts/CartAnalyticsChart';
import TestChart from './Charts/TestChart';

const Dashboard = () => {
  const [dashboardAnalytics, setDashboardAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setProductStats] = useState<any>({
    total: 0,
    cameras: 0,
    lenses: 0,
    accessories: 0
  });

  useEffect(() => {
    fetchDashboardAnalytics();
    fetchProductStats();
  }, []);

  const fetchProductStats = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products/stats');
      const data = await res.json();
      setProductStats(data);
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      console.log('Dashboard: Fetching analytics with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:3000/api/admin/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Dashboard: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard: Analytics data received:', data);
        setDashboardAnalytics(data);
      } else {
        const errorData = await response.json();
        console.error('Dashboard: Failed to fetch analytics:', errorData);
        setError(`Failed to fetch analytics: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Dashboard: Error fetching analytics:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold">Error Loading Dashboard</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchDashboardAnalytics}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      ) : dashboardAnalytics ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{dashboardAnalytics.users?.total || 0}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{dashboardAnalytics.orders?.total || 0}</div>
              <div className="text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{dashboardAnalytics.products?.total || 0}</div>
              <div className="text-gray-600">Total Products</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                ${dashboardAnalytics.trends?.monthlyOrders?.reduce((sum: number, item: any) => sum + item.totalRevenue, 0).toFixed(2) || '0.00'}
              </div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users:</span>
                  <span className="font-semibold">{dashboardAnalytics.users?.active || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disabled Users:</span>
                  <span className="font-semibold">{dashboardAnalytics.users?.disabled || 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Orders:</span>
                  <span className="font-semibold">{dashboardAnalytics.orders?.pending || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Orders:</span>
                  <span className="font-semibold">{dashboardAnalytics.orders?.completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled Orders:</span>
                  <span className="font-semibold">{dashboardAnalytics.orders?.cancelled || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dashboardAnalytics.products?.cameras || 0}</div>
                <div className="text-gray-600">Cameras</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{dashboardAnalytics.products?.lenses || 0}</div>
                <div className="text-gray-600">Lenses</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{dashboardAnalytics.products?.accessories || 0}</div>
                <div className="text-gray-600">Accessories</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">No dashboard data available</p>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
      
      {/* Test Chart - This should always show */}
      <TestChart />
      
      {/* Original RentalTrendsChart */}
      <RentalTrendsChart />
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <OrdersChart />
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <UserAnalyticsChart />
    </div>
  );

  const renderCart = () => (
    <div className="space-y-6">
      <CartAnalyticsChart />
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Bigger and more visible tab navigation */}
        <div className="bg-white border-b border-gray-200 mb-6 shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <nav className="flex space-x-2 py-10">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                📈 Analytics
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === 'orders'
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                📦 Orders
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                👥 Users
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                  activeTab === 'cart'
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                🛒 Cart
              </button>
            </nav>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'cart' && renderCart()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;