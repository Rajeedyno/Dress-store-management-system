import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${API_URL}/login`, form);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('role', res.data.role);
    onLogin(res.data.role);
    if (res.data.role === 'Admin') navigate('/admin');
    else if (res.data.role === 'Worker') navigate('/worker');
    else navigate('/customer');
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
      <h2 className="mb-4 text-2xl font-semibold">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded bg-pink-600 py-2 text-white" type="submit">Login</button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link to="/register" className="text-pink-600">Register</Link>
      </p>
    </div>
  );
}
