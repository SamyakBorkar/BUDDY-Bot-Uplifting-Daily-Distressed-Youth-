import React, { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(form);
      // backend may return { user } or user directly
      const userObj = res.user || res;
      const id = userObj._id || userObj.id;
      if (!id) throw new Error("User ID missing in response");
      login(userObj);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={onChange} required placeholder="Full name" className="w-full p-2 border rounded" />
        <input name="reg_no" value={form.reg_no} onChange={onChange} required placeholder="Registration Number" className="w-full p-2 border rounded" /> {/* Added reg_no input */}
        <input name="email" value={form.email} onChange={onChange} required placeholder="Email" type="email" className="w-full p-2 border rounded" />
        <input name="password" value={form.password} onChange={onChange} required placeholder="Password" type="password" className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
