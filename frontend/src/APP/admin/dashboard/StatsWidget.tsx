import React, { useEffect, useState } from 'react';

const StatsWidget = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setProductCount(data.length);
        } else {
          setError('Failed to fetch product count.');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductCount();
  }, []);

  return (
    <div className="bg-blue-100 border border-blue-300 rounded-xl shadow-sm p-4 md:p-6 text-blue-900 flex flex-col items-center justify-center min-h-[120px]">
      <div className="text-lg font-semibold mb-2">Total Products</div>
      {loading ? (
        <div className="text-blue-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="text-4xl font-bold">{productCount}</div>
      )}
    </div>
  );
};

export default StatsWidget;