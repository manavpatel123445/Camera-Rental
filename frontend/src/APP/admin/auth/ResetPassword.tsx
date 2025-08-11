import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token || !password) {
      setError("Token and new password are required.");
      return;
    }
    try {
      const res = await fetch("https://camera-rental-ndr0.onrender.com/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "Password has been reset successfully.");
        toast.success("Password reset! Please login.");
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/c.jpg')" }}>
      <form onSubmit={handleSubmit} className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-xl p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-white drop-shadow">Reset Password</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        <input
          type="text"
          placeholder="Enter your reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/70 focus:bg-white outline-none"
          required
        />
        <div className="w-full mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-10 rounded bg-white/70 focus:bg-white outline-none"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <button type="submit" className="w-full bg-white text-black font-semibold py-2 rounded-full shadow hover:bg-gray-200 transition">
          Reset Password
        </button>
        <button type="button" className="mt-4 text-blue-200 hover:underline" onClick={() => navigate('/admin/login')}>
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;