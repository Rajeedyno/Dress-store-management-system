import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function WorkerDashboard() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => setOrders(res.data));
  }, [token]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Worker Dashboard</h2>
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-3 font-semibold">Orders</h3>
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="flex justify-between rounded border p-2">
              <span>Order #{order.id}</span>
              <span>{order.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
