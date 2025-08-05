/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import type { AppDispatch } from '../store';
import { logout, fetchUserProfile, setUser, updateUserProfile, type User, type Address } from '../userAuth/userAuthSlice';
import { FaUserCircle, FaCamera, FaBell, FaMapMarkerAlt, FaHeart, FaCreditCard, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import { Button } from '../../components/ui/Button';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import CommonNavbar from '../../components/ui/CommonNavbar';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Redirect if no user is found
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Example stats (replace with real data)
  const stats = [
    { label: 'Total Orders', value: 0, icon: <FaCreditCard className="text-purple-400" /> },
    { label: 'Total Spent', value: '$0.00', icon: <FaCreditCard className="text-purple-400" /> },
    { label: 'Wishlist Items', value: 0, icon: <FaHeart className="text-purple-400" /> },
  ];

  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.username || '',
    email: user?.email || '',
    contact: user?.contact || '',
    description: user?.description || '',
  });
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
  });
  
  // Update form and address when user data changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.username || '',
        email: user.email || '',
        contact: user.contact || '',
        description: user.description || '',
      });
      
      if (user.address) {
        setAddress({
          street: user.address.street || '',
          city: user.address.city || '',
          state: user.address.state || '',
          zip: user.address.zip || '',
          country: user.address.country || '',
        });
      }
    }
  }, [user]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    // Only fetch profile if user exists and has a valid token
    const token = localStorage.getItem('token');
    if (user && token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

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

  useEffect(() => {
    // Set tab from URL query param on mount
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['profile', 'address', 'notifications', 'social'].includes(tabParam)) {
      setTab(tabParam);
    }
    // eslint-disable-next-line
  }, []);

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
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    const token = user?.token || localStorage.getItem('token');
    
    if (!token) {
      toast.error('Authentication token missing. Please log in again.');
      setIsLoading(false);
      return;
    }
    
    const toastId = toast.loading('Uploading profile image...');
    
    try {
      const res = await fetch('https://camera-rental-ndr0.onrender.com/api/user/profile/avatar', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include'
      });
      
      toast.dismiss(toastId);
      
      if (res.ok) {
        const data = await res.json();
        const avatarUrl = data.avatar.startsWith('http')
          ? data.avatar
          : `https://camera-rental-ndr0.onrender.com/${data.avatar.replace(/\\/g, '/')}`;
        dispatch(setUser({ ...user, avatar: avatarUrl }));
        setAvatarPreview(avatarUrl);
        toast.success('Profile image updated!');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Failed to upload image');
      console.error('Avatar upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (isLoading) return; // Prevent multiple submissions
    
    try {
      setIsLoading(true);
      
      console.log('Current form state:', form); // Debug: log form state
      console.log('Current address state:', address); // Debug: log address state
      console.log('Current user state:', user); // Debug: log user state
      
      // Create a partial User object for the update
      const profileData: Partial<User> = {
        username: form.name.trim(),
        email: form.email.trim()
      };
      
      // Only add non-empty fields
      if (form.contact?.trim()) {
        profileData.contact = form.contact.trim();
      }
      
      if (form.description?.trim()) {
        profileData.description = form.description.trim();
      }
      
      // Only include address if at least one field is filled
      const hasAddressData = Object.values(address).some(value => value?.trim?.());
      if (hasAddressData) {
        const addressData: Address = {
          street: address.street?.trim() || '',
          city: address.city?.trim() || '',
          state: address.state?.trim() || '',
          zip: address.zip?.trim() || '',
          country: address.country?.trim() || ''
        };
        profileData.address = addressData;
      }
      
      console.log('Profile data being sent:', profileData); // Debug: log profile data
      
      const toastId = toast.loading('Saving profile changes...');
      
      // Use the Redux thunk instead of direct fetch
      console.log('Dispatching updateUserProfile action...'); // Debug: log before dispatch
      const resultAction = await dispatch(updateUserProfile(profileData));
      console.log('Update profile result action:', resultAction); // Debug: log result action
      
      toast.dismiss(toastId);
      
      if (updateUserProfile.fulfilled.match(resultAction)) {
        // Success case
        console.log('Profile update successful!'); // Debug: log success
        setEditMode(false);
        toast.success('Profile updated successfully!');
      } else {
        // Error case
        console.error('Profile update failed:', resultAction); // Debug: log failure details
        console.error('Result action payload:', resultAction.payload); // Debug: log payload
        
        // Try direct fetch as fallback
        console.log('Trying direct fetch as fallback...');
        try {
          const token = user?.token || localStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication token missing');
          }
          
          const fallbackToastId = toast.loading('Retrying profile update...');
          
          const res = await fetch('https://camera-rental-ndr0.onrender.com/api/user/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
            credentials: 'include'
          });
          
          console.log('Fallback response status:', res.status);
          
          if (res.ok) {
            const data = await res.json();
            console.log('Fallback success response:', data);
            dispatch(setUser({ ...data, token })); // Make sure to preserve token
            setEditMode(false);
            toast.dismiss(fallbackToastId);
            toast.success('Profile updated successfully!');
            return; // Exit early on success
          } else {
            const errorText = await res.text();
            console.error('Fallback error response:', errorText);
            toast.dismiss(fallbackToastId);
            throw new Error('Fallback request failed');
          }
        } catch (fallbackError) {
          console.error('Fallback request error:', fallbackError);
          // Continue to show original error
        }
        
        // Show original error if fallback also failed
        const errorMessage = typeof resultAction.payload === 'string' 
          ? resultAction.payload 
          : (resultAction.payload && typeof resultAction.payload === 'object' && 'error' in resultAction.payload)
            ? resultAction.payload.error
            : 'Failed to update profile';
            
        console.error('Error message to display:', errorMessage); // Debug: log error message
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred while updating your profile');
      console.error('Profile update exception:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
                          : `https://camera-rental-ndr0.onrender.com/${avatarPreview.replace(/\\/g, '/')}`
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
                  disabled={isLoading}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                      handleAvatarUpload(file);
                    }
                  }}
                />
                <label 
                  htmlFor={isLoading ? '' : 'avatar-upload'} 
                  className={`absolute bottom-4 right-4 ${isLoading ? 'bg-gray-400' : 'bg-purple-400 hover:bg-purple-500'} text-white rounded-full p-2 border-4 border-[#232136] transition ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isLoading ? '...' : <FaCamera />}
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
                    <Button 
                      className="bg-purple-400 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2" 
                      onClick={handleSave}
                      type="button"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : <><FaSave /> Save</>}
                    </Button>
                    <Button 
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2" 
                      onClick={() => setEditMode(false)}
                      type="button"
                    >
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
                        <div className="font-bold text-white">{user.contact ? user.contact : "Not provided"}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Description</div>
                        <div className="font-bold text-white">{user.description ? user.description : "No description provided"}</div>
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