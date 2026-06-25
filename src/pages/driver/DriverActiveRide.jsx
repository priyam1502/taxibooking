import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Phone, MessageCircle } from 'lucide-react';
import { rideApi } from '../../api/rideApi';
import { connectSocket, getSocket } from '../../api/socketClient';

const DriverActiveRide = () => {
  const { rideId } = useParams();
  const { profile } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    rideApi.getById(rideId).then(({ data }) => setRide(data.ride));

    const socket = connectSocket({ role: 'driver', id: profile?._id });
    socket.emit('join_ride', rideId);
    socket.on('ride_message', (msg) => setChatMessages((prev) => [...prev, msg]));
    socket.on('ride_cancelled', ({ ride: updated }) => {
      setRide(updated);
      toast.error('Ride was cancelled by customer');
    });

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        socket.emit('driver_location', { rideId, lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

    return () => {
      socket.emit('leave_ride', rideId);
      socket.off('ride_message');
      socket.off('ride_cancelled');
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [rideId]);

  const handleStart = async () => {
    try {
      const { data } = await rideApi.start(rideId, otpInput);
      setRide(data.ride);
      toast.success('Ride started');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleEnd = async () => {
    try {
      const { data } = await rideApi.end(rideId);
      setRide(data.ride);
      toast.success('Ride completed!');
      setTimeout(() => navigate('/driver/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not end ride');
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    getSocket().emit('ride_message', { rideId, sender: 'driver', message: chatInput });
    setChatInput('');
  };

  if (!ride) return <p className="text-sm text-gray-500">Loading ride...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="card">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
          <p className="text-lg font-bold text-primary-600 capitalize mb-3">{ride.status}</p>
          <p className="text-sm text-gray-700"><b>Pickup:</b> {ride.pickup?.address}</p>
          <p className="text-sm text-gray-700"><b>Destination:</b> {ride.destination?.address}</p>
          <p className="text-sm text-gray-500 mt-2">{ride.distanceKm} km · Fare ₹{ride.fare?.estimated}</p>

          {/* Placeholder map - integrate @react-google-maps/api with navigation/route here */}
          <div className="mt-4 h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
            Navigation map goes here
          </div>
        </div>

        {ride.status === 'accepted' && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Enter customer's OTP to start ride</h3>
            <div className="flex gap-3">
              <input
                className="input-field"
                placeholder="4-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                maxLength={4}
              />
              <button onClick={handleStart} className="btn-primary px-6">Start Ride</button>
            </div>
          </div>
        )}

        {ride.status === 'ongoing' && (
          <button onClick={handleEnd} className="btn-primary w-full">End Ride</button>
        )}
      </div>

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Customer</h3>
          <p className="text-sm font-medium">{ride.customer?.fullName}</p>
          <a href={`tel:${ride.customer?.mobile}`} className="btn-primary w-full mt-3 flex items-center justify-center gap-2 text-sm">
            <Phone size={16} /> Call Customer
          </a>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MessageCircle size={18} /> Chat
          </h3>
          <div className="h-40 overflow-y-auto space-y-2 mb-3 text-sm">
            {chatMessages.map((m, i) => (
              <p key={i} className={m.sender === 'driver' ? 'text-right text-primary-700' : 'text-left text-gray-700'}>
                {m.message}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input-field" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." />
            <button onClick={handleSendMessage} className="btn-primary px-3">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverActiveRide;
