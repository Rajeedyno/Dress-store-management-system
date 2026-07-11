import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import RecommendationPage from './pages/RecommendationPage';

const getRole = () => localStorage.getItem('role') || 'Customer';

function App() {
  const [role, setRole] = useState(getRole());
  const token = localStorage.getItem('token');

  const isAuthenticated = Boolean(token);

  const navItems = useMemo(() => {
    if (role === 'Admin') return ['Admin Dashboard', 'Recommendations'];
    if (role === 'Worker') return ['Worker Dashboard'];
    return ['Shop', 'Recommendations'];
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole('Customer');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="font-semibold text-lg">Dress Store</div>
        <div className="flex gap-4 items-center">
          {navItems.map((item) => (
            <Link key={item} to={item === 'Admin Dashboard' ? '/admin' : item === 'Worker Dashboard' ? '/worker' : item === 'Recommendations' ? '/recommendations' : '/customer'} className="text-sm hover:text-pink-300">
              {item}
            </Link>
          ))}
          {isAuthenticated && (
            <button onClick={handleLogout} className="ml-3 rounded bg-pink-600 px-3 py-1 text-sm">
              Logout
            </button>
          )}
        </div>
      </nav>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? '/customer' : '/login'} replace />} />
          <Route path="/login" element={<LoginPage onLogin={(nextRole) => setRole(nextRole)} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={isAuthenticated && role === 'Admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/worker" element={isAuthenticated && role === 'Worker' ? <WorkerDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/customer" element={isAuthenticated ? <CustomerDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/recommendations" element={isAuthenticated ? <RecommendationPage /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
