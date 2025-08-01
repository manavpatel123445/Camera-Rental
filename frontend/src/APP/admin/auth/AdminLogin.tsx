import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { loginAndFetchProfile } from "../../auth/authSlice";
import toast from "react-hot-toast";
import backgroundImage from "../../../assets/c.jpg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    try {
      await dispatch(loginAndFetchProfile(email, password) as any);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-xl p-10 w-full max-w-md flex flex-col items-center"
      >
        <div className="mb-4">
          <FontAwesomeIcon icon={faCamera} size="3x" className="text-white drop-shadow" />
        </div>
        <h2 className="text-3xl font-bold mb-8 text-white drop-shadow">Admin Login</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="w-full mb-4 relative">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-white/70 focus:bg-white outline-none"
            required
            disabled={isLoading}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
        </div>
        <div className="w-full mb-6 relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-white/70 focus:bg-white outline-none"
            required
            disabled={isLoading}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faLock} />
          </span>
        </div>
        <button
          type="submit" 
          className="w-full bg-white text-black font-semibold py-2 rounded-full shadow hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-6 text-black text-center">
          <a href="/admin/forgot-password" className="text-blue-500 hover:underline mr-4">
            Forgot Password?
          </a>
          Don't have an account?{" "}
          <a href="/admin/register" className="text-blue-200 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;