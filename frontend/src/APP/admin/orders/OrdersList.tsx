import React, {  useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';

interface OrderItem {
  product: string;
  name: string;
  pricePerDay: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  user: { username: string; email: string };
  status: string;
  total: number;
  startDate?: string;
  endDate?: string;
  items: OrderItem[];
  createdAt: string;
}

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/admin/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <AdminLayout>
    <div className="max-w-8xl mx-auto pt-10">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Al  l Orders</h1>
      {loading ? (
        <div className="text-gray-400 p-8">Loading orders...</div>
      ) : error ? (
        <div className="text-red-400 p-8">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400 p-8">No orders found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rental Period</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{order.user?.username || order.user?._id || 'N/A'}</div>
                    <div className="text-xs text-slate-500">{order.user?.email || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={`px-2 py-1 rounded text-xs font-bold border ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      value={order.status}
                      disabled={order.status === 'cancelled'}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const token = localStorage.getItem('token');
                        const res = await fetch(`http://localhost:3000/api/admin/orders/${order._id}/status`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ status: newStatus }),
                          credentials: 'include',
                        });
                        if (res.ok) {
                          setOrders(orders => orders.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
                        }
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="shipped">shipped</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {order.startDate && order.endDate ? (
                      <>
                        {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}<br />
                        <span className="text-purple-500 font-semibold">(
                          {Math.max(1, Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24)))} days
                        )</span>
                      </>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ul className="space-y-1">
                      {order.items.map(item => (
                        <li key={item.product} className="flex items-center gap-2 text-slate-700 text-xs">
                          {item.image && <img src={item.image.startsWith('http') ? item.image : `http://localhost:3000/${item.image}`} alt={item.name} className="w-6 h-6 rounded object-cover" />}
                          <span className="font-bold">{item.name}</span>
                          <span className="ml-1">x{item.quantity}</span>
                          <span className="ml-1 text-slate-400">@ ${item.pricePerDay}/day</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this order?')) {
                          const token = localStorage.getItem('token');
                          const res = await fetch(`http://localhost:3000/api/admin/orders/${order._id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` },
                            credentials: 'include',
                          });
                          if (res.ok) {
                            setOrders(orders => orders.filter(o => o._id !== order._id));
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default OrdersList;