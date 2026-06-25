import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { IndianRupee, Star, Navigation as NavIcon, Power } from 'lucide-react';
import { driverAuthApi } from '../../api/authApi';
import { connectSocket, getSocket } from '../../api/socketClient';

const DriverDashboard = () => {
  const { profile } = useSelector((state) => state.auth);
  const [dashboard, setDashboard] = useState(null);
  const [online, setOnline] = useState(profile?.isOnline || false);

  const loadDashboard = () => driverAuthApi.dashboard().then(({ data }) => setDashboard(data.dashboard)).catch(() => {});

  useEffect(() => {
    loadDashboard();
    connectSocket({ role: 'driver', id: profile?._id });

    const socket = getSocket();
    socket.on('new_ride_request', () => {
      toast('New ride request received!', { icon: '🚕' });
    });

    return () => socket.off('new_ride_request');
  }, []);

  useEffect(() => {
    if (!online) return;
    const sendLocation = () => {
      navigator.geolocation?.getCurrentPosition((pos) => {
        driverAuthApi
          .updateLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            isOnline: true,
            isAvailable: true,
          })
          .catch(() => {});
      });
    };
    sendLocation();
    const interval = setInterval(sendLocation, 15000);
    return () => clearInterval(interval);
  }, [online]);

  const toggleOnline = async () => {
    const next = !online;
    setOnline(next);
    if (!next) {
      await driverAuthApi.updateLocation({ lat: 0, lng: 0, isOnline: false, isAvailable: false }).catch(() => {});
    }
    toast.success(next ? "You're now online" : "You're now offline");
  };

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between bg-primary-50 border-primary-100">
        <div>
          <p className="text-sm text-gray-600">Driver Status</p>
          <p className={`text-lg font-bold ${online ? 'text-green-600' : 'text-gray-500'}`}>
            {online ? 'Online — Accepting Rides' : 'Offline'}
          </p>
        </div>
        <button
          onClick={toggleOnline}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm ${
            online ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Power size={16} /> {online ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="card">
          <IndianRupee className="text-primary-600 mb-2" size={22} />
          <p className="text-sm text-gray-500">Today's Earnings</p>
          <p className="text-xl font-bold">₹{dashboard?.todayEarnings || 0}</p>
        </div>
        <div className="card">
          <IndianRupee className="text-primary-600 mb-2" size={22} />
          <p className="text-sm text-gray-500">Weekly Earnings</p>
          <p className="text-xl font-bold">₹{dashboard?.weeklyEarnings || 0}</p>
        </div>
        <div className="card">
          <IndianRupee className="text-primary-600 mb-2" size={22} />
          <p className="text-sm text-gray-500">Monthly Earnings</p>
          <p className="text-xl font-bold">₹{dashboard?.monthlyEarnings || 0}</p>
        </div>
        <div className="card">
          <Star className="text-yellow-500 mb-2" size={22} />
          <p className="text-sm text-gray-500">Rating</p>
          <p className="text-xl font-bold">{dashboard?.rating || 5} / 5</p>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <NavIcon className="text-primary-600" size={28} />
        <div>
          <p className="text-sm text-gray-500">Active Trips</p>
          <p className="font-semibold">{dashboard?.activeTrips || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
