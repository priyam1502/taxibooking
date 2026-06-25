import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { profileApi } from '../../api/rideApi';
import { updateProfile } from '../../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullName: profile?.fullName || '',
    emergencyContact: profile?.emergencyContact || { name: '', mobile: '' },
  });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await profileApi.update(form);
      dispatch(updateProfile(data.profile));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await profileApi.changePassword(pwd);
      toast.success('Password changed successfully');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Edit Profile</h3>
        <form onSubmit={handleSave} className="space-y-3">
          <input
            className="input-field"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Full Name"
          />
          <input className="input-field bg-gray-100" value={profile?.email} disabled />
          <input className="input-field bg-gray-100" value={profile?.mobile} disabled />
          <p className="text-sm font-medium text-gray-700 pt-2">Emergency Contact</p>
          <input
            className="input-field"
            placeholder="Contact Name"
            value={form.emergencyContact.name}
            onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })}
          />
          <input
            className="input-field"
            placeholder="Contact Mobile"
            value={form.emergencyContact.mobile}
            onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, mobile: e.target.value } })}
          />
          <button type="submit" className="btn-primary w-full">Save Changes</button>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <input
            type="password"
            className="input-field"
            placeholder="Current Password"
            value={pwd.currentPassword}
            onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="New Password"
            value={pwd.newPassword}
            onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary w-full">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
