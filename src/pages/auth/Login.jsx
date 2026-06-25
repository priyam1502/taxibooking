import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { setCredentials } from '../../features/auth/authSlice';

const Login = () => {
  const [form, setForm] = useState({ emailOrMobile: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      dispatch(setCredentials({ token: data.token, role: 'customer', profile: data.user }));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Login to RideGo</h2>
        <p className="text-sm text-gray-500 mb-6">Book your next ride in seconds.</p>
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
        <div className="flex justify-between text-sm mt-4">
          <Link to="/forgot-password" className="text-primary-600 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-primary-600 hover:underline">
            Create account
          </Link>
        </div>
        <div className="text-center text-xs text-gray-400 mt-6 space-x-3">
          <Link to="/driver/login" className="hover:text-gray-600">Driver Login</Link>
          <span>·</span>
          <Link to="/admin/login" className="hover:text-gray-600">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
