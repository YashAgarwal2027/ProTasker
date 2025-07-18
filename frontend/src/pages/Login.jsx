import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // to Handle Guest User-> 
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleGuestLogin = async () => {
    setError("");
    const guestCredentials = {
      email: "guest@protasker.com",
      password: "guest123",
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, guestCredentials);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Guest login failed");
    }
  };
  
  // to handle login button for register user->
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, formData);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mt-2"
          >
            Login as Guest
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
           Use Guest login to explore the app without registration.
        </p>
      </div>
    </div>
  );
};

export default Login;




  