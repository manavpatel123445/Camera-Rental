import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faSave, 
  faTimes, 
  faUser, 
  faCalendarAlt,
  faShieldAlt,
  faCog,
  faSignOutAlt,
  faCamera,
  faChartLine,
  faBoxes,
  faUsers} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import { fetchAdminProfile, setAdminUser, logout } from '../../auth/authSlice';

const AdminProfile = () => {
  const admin = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
  });

  // Initialize form data when admin data is available and fetch fresh profile data
  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username || '',
        email: admin.email || '',
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        phone: admin.phone || '',
        bio: admin.bio || '',
        dateOfBirth: admin.dateOfBirth || '',
      });
    } else {
      // If no admin data, try to fetch it
      dispatch(fetchAdminProfile() as any);
    }
  }, [admin, dispatch]);

  // Mock statistics data - replace with real data from your backend
  const stats = [
    { title: 'Total Orders', value: '1,234', icon: faBoxes, color: 'bg-blue-500' },
    { title: 'Active Users', value: '567', icon: faUsers, color: 'bg-green-500' },
    { title: 'Revenue', value: '$45,678', icon: faChartLine, color: 'bg-purple-500' },
    { title: 'Products', value: '89', icon: faBoxes, color: 'bg-orange-500' },
  ];

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
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(setAdminUser(data));
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        dispatch(logout());
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
      firstName: admin?.firstName || '',
      lastName: admin?.lastName || '',
      phone: admin?.phone || '',
      bio: admin?.bio || '',
      dateOfBirth: admin?.dateOfBirth || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      dateOfBirth: e.target.value,
    });
    setShowDatePicker(false);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const d = new Date(dateString);
    return d.toISOString().slice(0, 10);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/admin/profile/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(setAdminUser(data));
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    toast.success('Logged out successfully');
    window.location.href = '/admin/login';
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your profile and view system statistics</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {admin?.profileImage ? (
                        <img 
                          src={admin.profileImage.startsWith('http') ? admin.profileImage : `http://localhost:3000/${admin.profileImage}`}
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                            if (next) {
                              next.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <FontAwesomeIcon 
                        icon={faUser} 
                        className="text-3xl"
                        style={{ display: admin?.profileImage ? 'none' : 'flex' }}
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 transition-colors">
                      <FontAwesomeIcon icon={faCamera} className="text-gray-600 text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-bold">{admin?.username || 'Admin User'}</h2>
                  <p className="text-blue-100">{admin?.email || 'admin@example.com'}</p>
                </div>

                {/* Profile Actions */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />
                    <span className="text-gray-700">Administrator</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500" />
                    <span className="text-gray-700">Member since 2024</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <FontAwesomeIcon icon={faCog} className="text-gray-500" />
                    <span className="text-gray-700">Settings</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                      >
                        <FontAwesomeIcon icon={faSave} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                        disabled={!isEditing}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                        disabled={!isEditing}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      disabled={!isEditing}
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      disabled={!isEditing}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formatDateForInput(formData.dateOfBirth)}
                      onChange={handleDateChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all resize-none"
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </form>

                {/* Additional Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      to="/admin/change-password"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">Change Password</p>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faCog} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-800">Account Settings</p>
                        <p className="text-sm text-gray-600">Manage your account preferences</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;