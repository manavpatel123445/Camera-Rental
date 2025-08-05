import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import CommonNavbar from '../../components/ui/CommonNavbar';
import { FaUserCircle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://camera-rental-ndr0.onrender.com/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Registration successful! Please log in.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);
      } else {
        toast.error(data.message || 'Registration failed.');
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
          {/* User Icon */}
          <div className="flex justify-center w-full mt-10 mb-4">
            <FaUserCircle className="text-purple-500" size={64} />
          </div>
          {/* Register Form */}
          <div className="w-full flex flex-col items-center px-8 py-10">
            <h2 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">Create your account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-sm">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="bg-[#232136] text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                leftIcon={<FaUser className="text-gray-400" />}
              />
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
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="bg-[#232136] text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all pr-12"
                leftIcon={<FaLock className="text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="focus:outline-none"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                }
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-full mt-2 shadow-md transition-all"
                loading={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
            <div className="text-center mt-8 text-gray-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-purple-300 hover:underline transition-colors">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;