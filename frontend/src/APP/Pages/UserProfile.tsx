import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../userAuth/userAuthSlice';
import { FaUserCircle } from 'react-icons/fa';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import CommonNavbar from '../../components/ui/CommonNavbar';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232136] to-[#181622] text-white">
        <div className="bg-[#232136] p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <FaUserCircle className="mx-auto mb-4 text-7xl text-purple-500" />
          <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
          <Button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232136] to-[#181622] text-white">
      <CommonNavbar/>
      <div className="bg-[#232136] p-10 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col items-center">
        <div className="relative mb-6">
          <FaUserCircle className="text-8xl text-purple-500 drop-shadow-lg" />
          {/* Future: Add edit avatar button here */}
        </div>
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">{user.username}</h2>
        <p className="text-purple-300 mb-4">{user.email}</p>
        <div className="flex flex-col items-center gap-1 mb-6 w-full">
          {user.createdAt && (
            <p className="text-gray-400 text-sm">Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
          )}
          {user.updatedAt && (
            <p className="text-gray-400 text-sm">Last update: {new Date(user.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
        <Button
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-full mt-2 shadow-md transition-all"
        >
          Logout
        </Button>
        {/* Future: Add more profile actions/info here */}
      </div>
    </div>
  );
};

export default UserProfile; 