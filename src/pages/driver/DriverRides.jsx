import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { rideApi } from '../../api/rideApi';
import { connectSocket, getSocket } from '../../api/socketClient';

const DriverRides = () => {
  const { profile } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);

  const loadPending = () => rideApi.getPending().then(({ data }) => setRides(data.rides)).catch(() => {});

  useEffect(() => {
    loadPending();
    connectSocket({ role: 'driver', id: profile?._id });
    const socket = getSocket();

    socket.on('new_ride_request', (ride) => {
      setRides((prev) => [ride, ...prev]);
      toast('New ride request!', { icon: '🚕' });
    });
    socket.on('ride_dismissed', ({ rideId }) => {
      setRides((prev) => prev.filter((r) => r._id !== rideId));
    });

    return () => {
      socket.off('new_ride_request');
      socket.off('ride_dismissed');
    };
  }, []);

  const handleAccept = async (rideId) => {
    try {
      await rideApi.accept(rideId);
      toast.success('Ride accepted');
      navigate(`/driver/active/${rideId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept ride');
      loadPending();
    }
  };

  const handleReject = async (rideId) => {
    await rideApi.reject(rideId);
    setRides((prev) => prev.filter((r) => r._id !== rideId));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Incoming Ride Requests</h2>
      {rides.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">No pending ride requests right now.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rides.map((r) => (
            <div key={r._id} className="card">
              <p className="text-sm font-medium text-gray-800">{r.pickup?.address}</p>
              <p className="text-xs text-gray-500 mb-1">→ {r.destination?.address}</p>
              <p className="text-xs text-gray-500">{r.distanceKm} km · {r.vehicleType?.name}</p>
              <p className="text-lg font-bold text-primary-600 mt-2">₹{r.fare?.estimated}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleAccept(r._id)} className="btn-primary flex-1 text-sm">Accept</button>
                <button
                  onClick={() => handleReject(r._id)}
                  className="flex-1 text-sm border border-gray-300 rounded-lg font-semibold text-gray-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverRides;
