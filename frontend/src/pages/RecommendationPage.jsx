import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function RecommendationPage() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('token');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await axios.post(`${API_URL}/upload/`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
    const recRes = await axios.post(`${API_URL}/recommendations/`, { image_id: uploadRes.data.image_id }, { headers: { Authorization: `Bearer ${token}` } });
    setResults(recRes.data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">AI Dress Recommendations</h2>
      <div className="rounded-xl bg-white p-6 shadow">
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button className="rounded bg-pink-600 px-4 py-2 text-white" type="submit">Generate Recommendations</button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((item) => (
          <div key={item.dress_id} className="rounded-xl bg-white p-4 shadow">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-slate-600">{item.category}</p>
            <p className="mt-2 text-pink-600">${item.price}</p>
            <p className="text-sm">Confidence: {item.score * 100}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
