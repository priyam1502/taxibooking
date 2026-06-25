import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Upload, CheckCircle } from 'lucide-react';
import { driverAuthApi } from '../../api/authApi';
import { profileApi } from '../../api/rideApi';
import { updateProfile } from '../../features/auth/authSlice';

const docFields = [
  { key: 'license', label: 'Driving License' },
  { key: 'aadhaar', label: 'Aadhaar Card' },
  { key: 'pan', label: 'PAN Card' },
  { key: 'rc', label: 'RC Book' },
  { key: 'insurance', label: 'Insurance' },
];

const DriverProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const [vehicle, setVehicle] = useState(profile?.vehicle || {});
  const [bankDetails, setBankDetails] = useState(profile?.bankDetails || {});
  const [uploaded, setUploaded] = useState({});

  const handleUpload = async (key, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await driverAuthApi.uploadDoc(key, formData);
      setUploaded((prev) => ({ ...prev, [key]: true }));
      toast.success('Document uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleSaveVehicle = async () => {
    try {
      const { data } = await profileApi.update({ vehicle });
      dispatch(updateProfile(data.profile));
      toast.success('Vehicle details saved');
    } catch (err) {
      toast.error('Failed to save vehicle details');
    }
  };

  const handleSaveBank = async () => {
    try {
      const { data } = await profileApi.update({ bankDetails });
      dispatch(updateProfile(data.profile));
      toast.success('Bank details saved');
    } catch (err) {
      toast.error('Failed to save bank details');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-1">KYC Documents</h3>
        <p className="text-xs text-gray-500 mb-4">Upload all required documents to get approved for rides.</p>
        <div className="space-y-3">
          {docFields.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              {uploaded[key] ? (
                <CheckCircle className="text-green-600" size={18} />
              ) : (
                <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
                  <Upload size={14} /> Upload
                </span>
              )}
              <input type="file" className="hidden" onChange={(e) => handleUpload(key, e.target.files[0])} />
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Vehicle Details</h3>
          <div className="space-y-3">
            <select className="input-field" value={vehicle.type || ''} onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}>
              <option value="">Select Type</option>
              {['Mini', 'Sedan', 'SUV', 'Premium', 'Luxury', 'Rental', 'Outstation'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input className="input-field" placeholder="Brand" value={vehicle.brand || ''} onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })} />
            <input className="input-field" placeholder="Model" value={vehicle.model || ''} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} />
            <input className="input-field" placeholder="Number Plate" value={vehicle.number || ''} onChange={(e) => setVehicle({ ...vehicle, number: e.target.value })} />
            <button onClick={handleSaveVehicle} className="btn-primary w-full">Save Vehicle Details</button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Bank Details</h3>
          <div className="space-y-3">
            <input className="input-field" placeholder="Account Holder Name" value={bankDetails.accountHolder || ''} onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })} />
            <input className="input-field" placeholder="Account Number" value={bankDetails.accountNumber || ''} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} />
            <input className="input-field" placeholder="IFSC Code" value={bankDetails.ifsc || ''} onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })} />
            <input className="input-field" placeholder="Bank Name" value={bankDetails.bankName || ''} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} />
            <button onClick={handleSaveBank} className="btn-primary w-full">Save Bank Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
