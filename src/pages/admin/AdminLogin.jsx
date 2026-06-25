import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { setCredentials } from '../../features/auth/authSlice';

const AdminLogin = () => {
  const [form, setForm] = useState({ emailOrMobile: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      if (data.user.role !== 'admin') {
        toast.error('Not an admin account');
        return;
      }
      dispatch(setCredentials({ token: data.token, role: 'admin', profile: data.user }));
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-6">RideGo Platform Administration</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            placeholder="Admin Email"
            value={form.emailOrMobile}
            onChange={(e) => setForm({ ...form, emailOrMobile: e.target.value })}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
