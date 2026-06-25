import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/authApi';

const ForgotPassword = () => {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success('Reset instructions sent to your email');
      setStep('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      toast.success('Password reset successful. Please login.');
      setStep('done');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset your password</h2>
        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-4 mt-4">
            <input
              type="email"
              className="input-field"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        )}
        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4 mt-4">
            <input
              className="input-field"
              placeholder="Reset Token (from email)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {step === 'done' && (
          <p className="text-sm text-gray-600 mt-4">
            Your password has been reset.{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Go to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
