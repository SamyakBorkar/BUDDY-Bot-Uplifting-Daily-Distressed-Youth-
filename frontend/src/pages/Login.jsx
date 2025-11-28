import React, { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      // backend may return user or { user } or { token, user }
      const userObj = res.user || res;
      const id = userObj._id || userObj.id;
      if (!id) throw new Error("User ID missing in response");
      // save token if provided
      if (res.token) localStorage.setItem("buddy_token", res.token);
      login(userObj);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Continue your journey with BUDDY</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input 
              name="email" 
              value={form.email} 
              onChange={onChange} 
              required 
              placeholder="your@email.com" 
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              name="password" 
              value={form.password} 
              onChange={onChange} 
              required 
              placeholder="••••••••" 
              type="password" 
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
