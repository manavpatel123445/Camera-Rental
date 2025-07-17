import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const AdminProfile = () => {
  const admin = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: admin?.username || '',
    email: admin?.email || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ username: formData.username, email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'auth/setAdminUser', payload: data });
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        dispatch({ type: 'auth/logout' });
        toast.error('Session expired. Please log in again.');
        setTimeout(() => window.location.href = '/admin/login', 1000);
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Network error. Please try again later.');
    }
  };

  const handleCancel = () => {
    setFormData({
      username: admin?.username || '',
      email: admin?.email || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 md:gap-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Profile</h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-sm md:text-base"
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-sm md:text-base"
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow text-sm md:text-base"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            )}
          </div>
          <form className="space-y-6">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
                disabled={!isEditing}
              />
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;