import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { driverAuthApi } from '../../api/authApi';
import { setCredentials } from '../../features/auth/authSlice';

const DriverLogin = () => {
  const [form, setForm] = useState({ emailOrMobile: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await driverAuthApi.login(form);
      dispatch(setCredentials({ token: data.token, role: 'driver', profile: data.driver }));
      toast.success('Welcome back, Driver!');
      navigate('/driver/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Driver Login</h2>
        <p className="text-sm text-gray-500 mb-6">Access your trips and earnings.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            placeholder="Email or Mobile"
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
        <p className="text-center text-sm text-gray-500 mt-6">
          New driver?{' '}
          <Link to="/driver/register" className="text-primary-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DriverLogin;
