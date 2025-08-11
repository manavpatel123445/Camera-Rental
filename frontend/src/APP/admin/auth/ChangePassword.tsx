import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from query string if present
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    if (urlToken) setToken(urlToken);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token && (!currentPassword || !newPassword)) {
      setError("All fields are required.");
      return;
    }
    try {
      let endpoint = "https://camera-rental-ndr0.onrender.com/api/admin/change-password";
      let body;
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        // If token is present, use reset-password endpoint
        endpoint = "https://camera-rental-ndr0.onrender.com/api/admin/reset-password";
        body = JSON.stringify({ token, password: newPassword });
      } else {
        // Authenticated change password
        const authToken = localStorage.getItem("token");
        headers["Authorization"] = `Bearer ${authToken}`;
        body = JSON.stringify({ currentPassword, newPassword });
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "Password changed successfully.");
        toast.success("Password changed! Redirecting to dashboard...");
        setTimeout(() => navigate("/admin/dashboard"), 2000);
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
        <h2 className="text-2xl font-bold mb-6 text-white drop-shadow">Change Password</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        {!token && (
          <div className="w-full mb-4 relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded bg-white/70 focus:bg-white outline-none"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        )}
        <div className="w-full mb-6 relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 pr-10 rounded bg-white/70 focus:bg-white outline-none"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <button type="submit" className="w-full bg-white text-black font-semibold py-2 rounded-full shadow hover:bg-gray-200 transition">
          Change Password
        </button>
        <button type="button" className="mt-4 text-blue-200 hover:underline" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;