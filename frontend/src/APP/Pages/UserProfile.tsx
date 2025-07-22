import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import type { AppDispatch } from '../store';
import { logout, fetchUserProfile,  setUser } from '../userAuth/userAuthSlice';
import { FaUserCircle, FaCamera, FaBell, FaMapMarkerAlt, FaHeart, FaCreditCard, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import CommonNavbar from '../../components/ui/CommonNavbar';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Example stats (replace with real data)
  const stats = [
    { label: 'Total Orders', value: 0, icon: <FaCreditCard className="text-purple-400" /> },
    { label: 'Total Spent', value: '$0.00', icon: <FaCreditCard className="text-purple-400" /> },
    { label: 'Wishlist Items', value: 0, icon: <FaHeart className="text-purple-400" /> },
  ];

  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.username || '',
    email: user?.email || '',
    contact: '',
    description: '',
  });
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.username || '',
        email: user.email || '',
        contact: user.contact || '',
        description: user.description || '',
      });
      setAddress({
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zip: user.address?.zip || '',
        country: user.address?.country || '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    if (!user) return;
    const formData = new FormData();
    formData.append('avatar', file);
    const token = user?.token || localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/user/profile/avatar', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const avatarUrl = data.avatar.startsWith('http')
          ? data.avatar
          : `http://localhost:3000/${data.avatar.replace(/\\/g, '/')}`;
        dispatch(setUser({ ...user, avatar: avatarUrl }));
        setAvatarPreview(avatarUrl);
        toast.success('Profile image updated!');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    }
  };

  const handleSave = async () => {
    const profileData: any = {
      username: form.name,
      email: form.email,
      contact: form.contact,
      description: form.description,
      address,
    };
    // Do NOT send avatar here
    const token = user?.token || localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:3000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(setUser(data));
      setEditMode(false);
    } else {
      // Optionally show error
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#181622] text-white">
        <CommonNavbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-[#232136] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
            <FaUserCircle className="mx-auto mb-4 text-6xl text-purple-400" />
            <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
            <Button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg">Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#181622] text-white">
      <CommonNavbar />
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl p-8 md:p-12 bg-[#232136]">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Avatar and Stats */}
            <div className="flex flex-col items-center md:w-1/3">
              <div className="relative mb-4">
                <div className="w-36 h-36 rounded-full border-4 border-purple-400 flex items-center justify-center bg-[#181622] overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={
                        avatarPreview.startsWith('http')
                          ? avatarPreview
                          : `http://localhost:3000/${avatarPreview.replace(/\\/g, '/')}`
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-7xl text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                      handleAvatarUpload(file);
                    }
                  }}
                />
                <label htmlFor="avatar-upload" className="absolute bottom-4 right-4 bg-purple-400 text-white rounded-full p-2 border-4 border-[#232136] hover:bg-purple-500 transition cursor-pointer">
                  <FaCamera />
                </label>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{user.username}</div>
                <div className="text-gray-400">{user.email}</div>
              </div>
              <div className="mt-8 w-full">
                <div className="bg-[#181622] rounded-xl p-6 flex flex-col gap-4 shadow">
                  <div className="text-lg font-semibold mb-2">Account Statistics</div>
                  {stats.map(stat => (
                    <div key={stat.label} className="flex items-center justify-between text-gray-200">
                      <span className="flex items-center gap-2">{stat.icon}{stat.label}</span>
                      <span className="font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right: Profile Details */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                {!editMode ? (
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2" onClick={() => setEditMode(true)}>
                    <FaEdit /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button className="bg-purple-400 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2" onClick={handleSave}>
                      <FaSave /> Save
                    </Button>
                    <Button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2" onClick={() => setEditMode(false)}>
                      <FaTimes /> Cancel
                    </Button>
                  </div>
                )}
              </div>
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTab('profile')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'profile' ? 'bg-purple-400 text-white' : 'bg-[#232136] text-gray-200 border border-gray-700'}`}>
                  <FaEdit className="inline mr-2" /> Profile
                </button>
                <button onClick={() => setTab('address')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'address' ? 'bg-purple-400 text-white' : 'bg-[#232136] text-gray-200 border border-gray-700'}`}>
                  <FaMapMarkerAlt className="inline mr-2" /> Address
                </button>
                <button onClick={() => setTab('notifications')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'notifications' ? 'bg-purple-400 text-white' : 'bg-[#232136] text-gray-200 border border-gray-700'}`}>
                  <FaBell className="inline mr-2" /> Notifications
                </button>
                <button onClick={() => setTab('social')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'social' ? 'bg-purple-400 text-white' : 'bg-[#232136] text-gray-200 border border-gray-700'}`}>
                  <FaUserCircle className="inline mr-2" /> Social Links
                </button>
              </div>
              {/* Profile Details */}
              <div className="bg-[#181622] rounded-xl p-6 flex-1">
                {tab === 'profile' && (
                  !editMode ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-gray-400">Name</div>
                        <div className="font-bold text-white">{user.username}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Email</div>
                        <div className="font-bold text-white">{user.email}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Contact Number</div>
                        <div className="font-bold text-white">Not provided</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Description</div>
                        <div className="font-bold text-white">No description provided</div>
                      </div>
                    </div>
                  ) : (
                    <form className="space-y-4">
                      <div>
                        <div className="text-gray-400">Name</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-gray-400">Email</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-gray-400">Contact Number</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={form.contact}
                          onChange={e => setForm({ ...form, contact: e.target.value })}
                          placeholder="Enter your contact number"
                        />
                      </div>
                      <div>
                        <div className="text-gray-400">Description</div>
                        <textarea
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </form>
                  )
                )}
                {tab === 'address' && (
                  !editMode ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-gray-400">Street</div>
                        <div className="font-bold text-white">{address.street || 'Not provided'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">City</div>
                        <div className="font-bold text-white">{address.city || 'Not provided'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">State</div>
                        <div className="font-bold text-white">{address.state || 'Not provided'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Zip</div>
                        <div className="font-bold text-white">{address.zip || 'Not provided'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Country</div>
                        <div className="font-bold text-white">{address.country || 'Not provided'}</div>
                      </div>
                    </div>
                  ) : (
                    <form className="space-y-4">
                      <div>
                        <div className="text-gray-400">Street</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={address.street}
                          onChange={e => setAddress({ ...address, street: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-gray-400">City</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={address.city}
                          onChange={e => setAddress({ ...address, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-gray-400">State</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={address.state}
                          onChange={e => setAddress({ ...address, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-gray-400">Zip</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={address.zip}
                          onChange={e => setAddress({ ...address, zip: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-gray-400">Country</div>
                        <input
                          className="w-full bg-[#232136] text-white border border-gray-700 rounded-lg px-4 py-2 mt-1"
                          value={address.country}
                          onChange={e => setAddress({ ...address, country: e.target.value })}
                        />
                      </div>
                    </form>
                  )
                )}
                {tab === 'notifications' && (
                  <div className="text-gray-400">Notification settings coming soon...</div>
                )}
                {tab === 'social' && (
                  <div className="text-gray-400">Social links management coming soon...</div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  className="bg-purple-400 hover:bg-purple-500 text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={() => {
                    dispatch(logout());
                    navigate('/login');
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 