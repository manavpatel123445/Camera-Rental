import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";


const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("https://camera-rental-ndr0.onrender.com/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful! Please login.");
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/src/assets/c.jpg')", 
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-xl p-10 w-full max-w-md flex flex-col items-center"
      >
        <div className="mb-4">
          <FontAwesomeIcon icon={faCamera} size="3x" className="text-white drop-shadow" />
        </div>
        <h2 className="text-3xl font-bold mb-8 text-white drop-shadow">Register</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        <div className="w-full mb-4 relative">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-white/70 focus:bg-white outline-none"
            required
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faUser} />
          </span>
        </div>
        <div className="w-full mb-4 relative">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-white/70 focus:bg-white outline-none"
            required
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
        </div>
        <div className="w-full mb-4 relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-white/70 focus:bg-white outline-none"
            required
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faLock} />
          </span>
        </div>
        <div className="w-full mb-6 relative">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-white/70 focus:bg-white outline-none"
            required
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faLock} />
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-2 rounded-full shadow hover:bg-gray-200 transition"
        >
          Register
        </button> 
        <div className="mt-6 text-white text-center">
          Already have an account?{" "}
          <a href="/admin/login" className="text-blue-200 hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default AdminRegister;