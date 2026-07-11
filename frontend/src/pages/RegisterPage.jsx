import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'Customer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${API_URL}/register`, form);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('role', res.data.role);
    navigate('/customer');
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
      <h2 className="mb-4 text-2xl font-semibold">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full rounded border p-2" placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full rounded border p-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="Customer">Customer</option>
          <option value="Worker">Worker</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="w-full rounded bg-pink-600 py-2 text-white" type="submit">Register</button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-pink-600">Login</Link>
      </p>
    </div>
  );
}
