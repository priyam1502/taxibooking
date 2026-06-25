import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { driverAuthApi } from '../../api/authApi';
import { setCredentials } from '../../features/auth/authSlice';

const perks = [
  'Earn on your own schedule',
  'Weekly payouts to your bank account',
  'Free accident insurance coverage',
  '24/7 driver support',
];

const BecomeDriver = () => {
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await driverAuthApi.register(form);
      dispatch(setCredentials({ token: data.token, role: 'driver', profile: data.driver }));
      toast.success('Registered! Complete your KYC to get approved.');
      navigate('/driver/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Drive with RideGo, earn on your terms</h1>
        <p className="text-gray-600 mb-6">Join thousands of drivers earning flexible income across the city.</p>
        <ul className="space-y-3">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-3 text-gray-700">
              <span className="w-2 h-2 rounded-full bg-primary-500" /> {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Driver Registration</h2>
        <p className="text-sm text-gray-500 mb-6">Takes less than 2 minutes</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Create Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Registering...' : 'Register as Driver'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeDriver;
