import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function CustomerDashboard() {
  const [dresses, setDresses] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_URL}/dresses/`, { params: { category }, headers: { Authorization: `Bearer ${token}` } }).then((res) => setDresses(res.data));
    axios.get(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => setOrders(res.data));
  }, [category, token]);

  const filteredDresses = dresses.filter((dress) => dress.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (dress) => {
    setCart((prev) => [...prev, { dress_id: dress.id, quantity: 1 }]);
  };

  const placeOrder = async () => {
    await axios.post(`${API_URL}/orders/`, { items: cart }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Order placed');
    setCart([]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Dashboard</h2>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="flex gap-4">
            <input className="flex-1 rounded border p-2" placeholder="Search dresses" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="rounded border p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Formal">Formal</option>
              <option value="Casual">Casual</option>
              <option value="Party Wear">Party Wear</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDresses.map((dress) => (
              <div key={dress.id} className="rounded-xl bg-white p-4 shadow">
                <h3 className="font-semibold">{dress.name}</h3>
                <p className="text-sm text-slate-600">{dress.category}</p>
                <p className="mt-2 text-pink-600">${dress.price}</p>
                <p className="text-sm">Stock: {dress.stock}</p>
                <button className="mt-3 rounded bg-slate-900 px-3 py-1 text-white" onClick={() => addToCart(dress)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="font-semibold">Cart</h3>
            <ul className="mt-2 space-y-2">
              {cart.map((item, index) => (
                <li key={index} className="text-sm">Dress #{item.dress_id} x {item.quantity}</li>
              ))}
            </ul>
            <button className="mt-3 rounded bg-pink-600 px-3 py-1 text-white" onClick={placeOrder}>Place Order</button>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="font-semibold">Order History</h3>
            <ul className="mt-2 space-y-2">
              {orders.map((order) => (
                <li key={order.id} className="text-sm">#{order.id} - {order.status}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
