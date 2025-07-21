import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import CommonNavbar from '../../components/ui/CommonNavbar';
import { FaUserCircle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setUser } from '../userAuth/userAuthSlice';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        dispatch(setUser({
          username: data.username || '',
          email: data.email,
          token: data.token,
        }));
        localStorage.setItem('token', data.token); 
        toast.success('Logged in successfully!');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        toast.error(data.message || 'Login failed.');
      }
    } catch (err) {
      toast.error('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#181622] font-sans">
      <CommonNavbar />
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="bg-[#181622] rounded-3xl shadow-2xl w-full max-w-lg flex flex-col items-center p-0 md:p-0">
          {/* Top: Image */}
          <div className="w-full flex justify-center pt-10">
            
          </div> 
          {/* User Icon */}
          <div className="flex justify-center w-full mt-[-2.5rem] mb-4">
            <FaUserCircle className="text-purple-500" size={64} />
          </div>
          {/* Login Form */}
          <div className="w-full flex flex-col items-center px-8 py-10">
            <h2 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">Welcome back</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-sm">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-[#232136] text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                leftIcon={<FaEnvelope className="text-gray-400" />}
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-[#232136] text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all pr-12"
                leftIcon={<FaLock className="text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="focus:outline-none"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                }
              />
              <div className="flex items-center justify-between text-sm text-gray-400 w-full">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="accent-purple-600 focus:ring-2 focus:ring-purple-400"
                  />
                  Remember me
                </label>
                <a href="#" className="hover:underline text-purple-300 transition-colors">Forgot password?</a>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-full mt-2 shadow-md transition-all"
                loading={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="text-center mt-8 text-gray-400 text-sm">
              Don't have an account?{' '}
      
              <Link to="/register" className="text-purple-300 hover:underline transition-colors">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;