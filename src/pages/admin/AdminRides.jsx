import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';

const tabs = [
  { key: 'active', label: 'Active Rides', fn: 'getActiveRides' },
  { key: 'completed', label: 'Completed Rides', fn: 'getCompletedRides' },
  { key: 'cancelled', label: 'Cancelled Rides', fn: 'getCancelledRides' },
];

const AdminRides = () => {
  const [tab, setTab] = useState('active');
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const { fn } = tabs.find((t) => t.key === tab);
    adminApi[fn]().then(({ data }) => setRides(data.rides)).catch(() => {});
  }, [tab]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Ride Management</h2>
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Customer</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Vehicle</th>
              <th>Fare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((r) => (
              <tr key={r._id} className="border-b last:border-0">
                <td className="py-3 font-medium">{r.customer?.fullName}</td>
                <td>{r.driver?.fullName || '—'}</td>
                <td className="max-w-xs truncate">{r.pickup?.address} → {r.destination?.address}</td>
                <td>{r.vehicleType?.name}</td>
                <td>₹{r.fare?.final || r.fare?.estimated}</td>
                <td className="capitalize">{r.status}</td>
              </tr>
            ))}
            {rides.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-500 py-6">No rides found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRides;
