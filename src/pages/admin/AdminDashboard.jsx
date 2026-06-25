import { useEffect, useState } from 'react';
import { Users, Car, Navigation, IndianRupee, BookOpen } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.dashboard().then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-blue-600' },
    { label: 'Total Drivers', value: stats?.totalDrivers, icon: Car, color: 'text-green-600' },
    { label: 'Active Rides', value: stats?.activeRides, icon: Navigation, color: 'text-orange-600' },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: BookOpen, color: 'text-purple-600' },
    { label: 'Revenue', value: `₹${stats?.revenue || 0}`, icon: IndianRupee, color: 'text-primary-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <Icon className={`${color} mb-2`} size={24} />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
