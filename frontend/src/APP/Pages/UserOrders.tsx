import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import CommonNavbar from '../../components/ui/CommonNavbar';
import { FaListAlt } from 'react-icons/fa';

const UserOrders: React.FC = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    const token = user?.token || localStorage.getItem('token');
    fetch('http://localhost:3000/api/user/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#181622] text-white">
        <CommonNavbar />
        <div className="flex flex-1 w-full">
          <div className="bg-[#232136] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
            <FaListAlt className="mx-auto mb-4 text-6xl text-purple-400" />
            <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
            <button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg">Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#181622] text-white">
      <CommonNavbar />
      <div className="flex flex-1  py-8">
        <div className="w-full  mx-auto rounded-2xl shadow-2xl p-8 md:p-12 bg-[#232136]">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2"><FaListAlt /> My Orders</h1>
          {ordersLoading ? (
            <div className="text-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-400">No orders found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-[#232136] border border-gray-700 rounded-xl p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="text-sm text-gray-400">Order ID: <span className="text-white font-mono">{order._id}</span></div>
                    <div className="text-sm text-gray-400">Date: <span className="text-white">{new Date(order.createdAt).toLocaleString()}</span></div>
                    <div className="text-sm text-gray-400">Status: <span className="font-bold capitalize text-purple-400">{order.status}</span></div>
                    <div className="text-sm text-gray-400">Total: <span className="text-white font-bold">${order.total.toFixed(2)}</span></div>
                  </div>
                  {/* Rental Period */}
                  {order.startDate && order.endDate && (
                    <div className="text-sm text-gray-300 mb-2">
                      Rental Period: <span className="text-white font-semibold">{new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}</span>
                      <span className="ml-2 text-purple-400">(
                        {Math.max(1, Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24)))} days
                      )</span>
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="font-semibold text-white mb-2">Items:</div>
                    <ul className="space-y-1">
                      {order.items.map((item: any) => (
                        <li key={item.product} className="flex items-center gap-2 text-gray-200">
                          {item.image && <img src={item.image.startsWith('http') ? item.image : `http://localhost:3000/${item.image}`} alt={item.name} className="w-8 h-8 rounded object-cover" />}
                          <span className="font-bold">{item.name}</span>
                          <span className="ml-2">x{item.quantity}</span>
                          <span className="ml-2 text-gray-400">@ ${item.pricePerDay}/day</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Cancel Order Button */}
                  {order.status !== 'cancelled' && (
                    <button
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
                      onClick={async () => {
                        const token = user?.token || localStorage.getItem('token');
                        await fetch(`http://localhost:3000/api/user/orders/${order._id}/cancel`, {
                          method: 'PATCH',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        // Re-fetch orders from backend
                        setOrdersLoading(true);
                        fetch('http://localhost:3000/api/user/orders', {
                          headers: { Authorization: `Bearer ${token}` },
                        })
                          .then(res => res.json())
                          .then(data => {
                            setOrders(Array.isArray(data) ? data : []);
                            setOrdersLoading(false);
                          })
                          .catch(() => setOrdersLoading(false));
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders; 