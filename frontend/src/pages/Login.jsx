import React, { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Welcome back</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" value={form.email} onChange={onChange} required placeholder="Email" className="w-full p-2 border rounded" />
        <input name="password" value={form.password} onChange={onChange} required placeholder="Password" type="password" className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
