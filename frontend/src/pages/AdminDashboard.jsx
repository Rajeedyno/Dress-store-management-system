import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function AdminDashboard() {
  const [dresses, setDresses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_URL}/dresses/`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => setDresses(res.data));
    axios.get(`${API_URL}/inventory/`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => setInventory(res.data));
    axios.get(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => setOrders(res.data));
  }, [token]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow">Total Dresses: {dresses.length}</div>
        <div className="rounded-xl bg-white p-4 shadow">Low Stock Items: {inventory.filter((item) => item.is_low_stock).length}</div>
        <div className="rounded-xl bg-white p-4 shadow">Orders: {orders.length}</div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-3 font-semibold">Inventory</h3>
        <ul className="space-y-2">
          {inventory.map((item) => (
            <li key={item.id} className="flex justify-between rounded border p-2">
              <span>{item.dress_name}</span>
              <span className={item.is_low_stock ? 'text-red-600' : 'text-green-600'}>Stock {item.stock_quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
