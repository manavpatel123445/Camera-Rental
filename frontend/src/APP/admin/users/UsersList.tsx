import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import AdminLayout from '../components/AdminLayout';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/admin/users', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.message || 'Failed to fetch users.');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    user =>
      (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };
  const handleDisable = (userId: string) => {
    setUsers(prev => prev.filter(u => u._id !== userId));
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'disabled') => {
    setStatusLoading(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      } else {
        alert(data.message || 'Failed to update user status.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setStatusLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Users</h1>
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-0 overflow-x-auto">
          {loading ? (
            <div className="text-gray-400 p-8">Loading users...</div>
          ) : error ? (
            <div className="text-red-400 p-8">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredUsers.map((user, idx) => (
                  <tr key={user._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-slate-700">{user.role || 'user'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${((user.status || 'active') === 'active') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status || 'active'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => handleView(user)}>View</Button>
                      {user.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-300 text-slate-700 hover:bg-slate-100"
                          onClick={() => handleStatusChange(user._id, 'disabled')}
                          disabled={statusLoading === user._id}
                        >
                          {statusLoading === user._id ? 'Disabling...' : 'Disable'}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                          onClick={() => handleStatusChange(user._id, 'active')}
                          disabled={statusLoading === user._id}
                        >
                          {statusLoading === user._id ? 'Activating...' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* User Detail Modal */}
        {modalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-purple-400"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">User Details</h2>
              <div className="space-y-2 text-slate-700">
                <div><strong>Name:</strong> {selectedUser.name}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
                <div><strong>Role:</strong> {selectedUser.role || 'user'}</div>
                <div><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs font-bold ${((selectedUser.status || 'active') === 'active') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedUser.status || 'active'}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}