import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    try {
      const res = await fetch("https://camera-rental-ndr0.onrender.com/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "If this email is registered, a password reset link will be sent.");
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
        <h2 className="text-2xl font-bold mb-6 text-white drop-shadow">Forgot Password</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-white/70 focus:bg-white outline-none"
          required
        />
        <button type="submit" className="w-full bg-white text-black font-semibold py-2 rounded-full shadow hover:bg-gray-200 transition">
          Send Reset Link
        </button>
        <button type="button" className="mt-4 text-blue-200 hover:underline" onClick={() => navigate('/admin/change-password')}>
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword; 