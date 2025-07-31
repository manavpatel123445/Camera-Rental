import { useEffect, useState } from 'react';

const StatsWidget = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const token = localStorage.getItem('token');
        const authToken = adminToken || token;
        
        if (!authToken) {
          setError('No authentication token found');
          return;
        }

        const res = await fetch('http://localhost:3000/api/products/stats', {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.status === 401) {
          setError('Authentication failed');
          return;
        }
        
        const data = await res.json();
        if (res.ok) {
          setProductCount(data.total || 0);
        } else {
          setError(data.message || 'Failed to fetch stats');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProductCount();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-red-600">
          <p className="text-sm">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Products</h3>
      <p className="text-3xl font-bold text-blue-600">{productCount || 0}</p>
    </div>
  );
};

export default StatsWidget;