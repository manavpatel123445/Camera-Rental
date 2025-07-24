

import AdminLayout from '../components/AdminLayout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
 
  faShoppingCart,
  faClock,
  faCheckCircle,


} from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [productStats, setProductStats] = useState({ total: 0, cameras: 0, lenses: 0, accessories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products/stats');
        const data = await res.json();
        setProductStats(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchStats();
  }, []);
  
  // Remove all mock/static product data arrays and only keep the API-driven product stats and the rest of the dashboard UI.

  const feedItems = [
    {
      id: 1,
      icon: faShoppingCart,
      title: 'New Order Received',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: faClock,
      title: 'Pending Task: Process Returns',
      time: '4 hours ago'
    },
    {
      id: 3,
      icon: faCheckCircle,
      title: 'Completed Task: Inventory Update',
      time: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Product Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 mt-10">
          <div className="bg-white p-6 rounded-xl text-center shadow">
            <div className="text-3xl font-bold ">{productStats.total}</div>
            <div className="text-gray-500 mt-2">Total Products</div>
            </div>
          <div className="bg-white p-6 rounded-xl text-center shadow">
            <div className="text-3xl font-bold ">{productStats.cameras}</div>
            <div className="text-gray-500 mt-2">Cameras</div>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow">
            <div className="text-3xl font-bold ">{productStats.lenses}</div>
            <div className="text-gray-500 mt-2">Lenses</div>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow">
            <div className="text-3xl font-bold">{productStats.accessories}</div>
            <div className="text-gray-500 mt-2">Accessories</div>
          </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <div className="max-w-6xl mx-auto">
              {/* Dashboard Title */}
              <div className="mb-10 mt-10">
                <h1 className="text-gray-800 text-3xl font-bold">Dashboard</h1>
              </div>

              {/* Metrics Cards */}
              <div className="flex flex-wrap gap-4 mb-8">
                {/* Satisfaction Metrics */}
                <div className="flex min-w-72 flex-1 flex-col gap-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-800 text-base font-medium">Satisfaction Metrics</p>
                  <p className="text-gray-800 text-3xl font-bold">95%</p>
                  <div className="flex gap-1">
                    <p className="text-gray-600 text-base">Current</p>
                    <p className="text-green-600 text-base font-medium">+5%</p>
                  </div>
                  <div className="grid gap-y-4 py-3">
                    {/* This section was removed as per the edit hint */}
                  </div>
                </div>

                {/* Sales Distribution */}
                <div className="flex min-w-72 flex-1 flex-col gap-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-800 text-base font-medium">Sales Distribution</p>
                  <p className="text-gray-800 text-3xl font-bold">80%</p>
                  <div className="flex gap-1">
                    <p className="text-gray-600 text-base">Current</p>
                    <p className="text-green-600 text-base font-medium">+3%</p>
                  </div>
                  <div className="grid gap-y-4 py-3">
                    {/* This section was removed as per the edit hint */}
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="flex flex-wrap gap-4 mb-8">
                {/* This section was removed as per the edit hint */}
              </div>

              {/* New Products Table */}
              <div className="mb-8">
                <h2 className="text-gray-800 text-2xl font-bold mb-4">New Products</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Product Image</th>
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Stock Status</th>
                        <th className="px-4 py-3 text-left text-gray-800 text-sm font-medium">Price</th>
                        <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* This section was removed as per the edit hint */}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Feed Section */}
              <div>
                <h2 className="text-gray-800 text-2xl font-bold mb-4">Feed</h2>
                <div className="flex flex-col gap-4">
                  {feedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4">
                      <FontAwesomeIcon icon={item.icon} className="text-xl text-gray-600" />
                      <div>
                        <p className="text-gray-800 font-medium">{item.title}</p>
                        <p className="text-gray-500 text-sm">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    
    </AdminLayout>
  );
};

export default Dashboard;