import React, { useState } from 'react';
import { FaUserCircle, FaCog, FaSignOutAlt, FaEdit, FaTimes, FaShieldAlt, FaCalendarAlt, FaCamera } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setAdminUser } from '../../auth/authSlice';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const admin = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: admin?.firstName || '',
    lastName: admin?.lastName || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
    bio: admin?.bio || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      const authToken = adminToken || token;
      
      const res = await fetch("https://camera-rental-ndr0.onrender.com/api/admin/profile/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://camera-rental-ndr0.onrender.com/api/admin/profile", {
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
        toast.success('Profile updated successfully!');
        setIsEditing(false);
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
      firstName: admin?.firstName || '',
      lastName: admin?.lastName || '',
      email: admin?.email || '',
      phone: admin?.phone || '',
      bio: admin?.bio || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    toast.success('Logged out successfully');
    onClose();
    window.location.href = '/admin/login';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="w-full max-w-sm bg-[var(--secondary-bg)] rounded-xl shadow-2xl border border-[var(--border-color)] relative max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Profile</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-4">
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-bg)] flex items-center justify-center overflow-hidden">
                {admin?.profileImage ? (
                  <img 
                    src={admin.profileImage.startsWith('http') ? admin.profileImage : `https://camera-rental-ndr0.onrender.com/${admin.profileImage}`}
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                      if (next) {
                        next.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <FaUserCircle 
                  className="w-12 h-12 text-[var(--text-secondary)]"
                  style={{ display: admin?.profileImage ? 'none' : 'flex' }}
                />
              </div>
              {/* Camera icon overlay for image upload */}
              <label className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors">
                <FaCamera className="text-white text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs">Uploading...</div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {admin?.firstName} {admin?.lastName}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">{admin?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <FaShieldAlt className="text-xs text-blue-500" />
                <span className="text-xs text-blue-500 font-medium">Administrator</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-2 py-1.5 text-sm border border-[var(--border-color)] rounded-md bg-[var(--primary-bg)] text-[var(--text-primary)] disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-2 py-1.5 text-sm border border-[var(--border-color)] rounded-md bg-[var(--primary-bg)] text-[var(--text-primary)] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-2 py-1.5 text-sm border border-[var(--border-color)] rounded-md bg-[var(--primary-bg)] text-[var(--text-primary)] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-2 py-1.5 text-sm border border-[var(--border-color)] rounded-md bg-[var(--primary-bg)] text-[var(--text-primary)] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={2}
                disabled={!isEditing}
                className="w-full px-2 py-1.5 text-sm border border-[var(--border-color)] rounded-md bg-[var(--primary-bg)] text-[var(--text-primary)] disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-[var(--border-color)] text-[var(--text-primary)] rounded-md hover:bg-[var(--primary-bg)] transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Additional Actions */}
          <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 