import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Phone, MessageCircle, ShieldAlert, Star } from 'lucide-react';
import { rideApi } from '../../api/rideApi';
import { connectSocket, getSocket } from '../../api/socketClient';
import { updateDriverLocation, setActiveRide, clearRide } from '../../features/ride/rideSlice';

const RideTracking = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { driverLocation } = useSelector((state) => state.ride);
  const [ride, setRide] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    rideApi.getById(rideId).then(({ data }) => {
      setRide(data.ride);
      dispatch(setActiveRide(data.ride));
    });

    const socket = connectSocket({ role: 'customer', id: profile?._id });
    socket.emit('join_ride', rideId);

    socket.on('location_update', ({ lat, lng }) => dispatch(updateDriverLocation({ lat, lng })));
    socket.on('driver_location_update', ({ lat, lng }) => dispatch(updateDriverLocation({ lat, lng })));
    socket.on('ride_accepted', ({ ride: updated }) => setRide(updated));
    socket.on('ride_started', ({ ride: updated }) => setRide(updated));
    socket.on('ride_completed', ({ ride: updated }) => {
      setRide(updated);
      toast.success('Ride completed! Please rate your trip.');
    });
    socket.on('ride_cancelled', ({ ride: updated }) => {
      setRide(updated);
      toast.error('Ride was cancelled');
    });
    socket.on('ride_message', (msg) => setChatMessages((prev) => [...prev, msg]));

    return () => {
      socket.emit('leave_ride', rideId);
      socket.off('location_update');
      socket.off('driver_location_update');
      socket.off('ride_accepted');
      socket.off('ride_started');
      socket.off('ride_completed');
      socket.off('ride_cancelled');
      socket.off('ride_message');
    };
  }, [rideId]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    getSocket().emit('ride_message', { rideId, sender: 'customer', message: chatInput });
    setChatInput('');
  };

  const handleSOS = () => {
    getSocket().emit('sos_triggered', {
      rideId,
      userId: profile?._id,
      role: 'customer',
      lat: driverLocation?.lat,
      lng: driverLocation?.lng,
    });
    toast.success('SOS sent. Our support team has been alerted.');
  };

  const handleCancel = async () => {
    try {
      await rideApi.cancel(rideId, 'Customer cancelled');
      toast.success('Ride cancelled');
      dispatch(clearRide());
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel ride');
    }
  };

  const handleRate = async () => {
    try {
      await rideApi.rate(rideId, { rating });
      toast.success('Thanks for your feedback!');
      dispatch(clearRide());
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  if (!ride) return <p className="text-sm text-gray-500">Loading ride details...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="card">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
              <p className="text-lg font-bold text-primary-600 capitalize">{ride.status}</p>
            </div>
            {ride.otp && ride.status === 'accepted' && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Share OTP with driver</p>
                <p className="text-2xl font-bold tracking-widest">{ride.otp}</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-700"><b>Pickup:</b> {ride.pickup?.address}</p>
          <p className="text-sm text-gray-700"><b>Destination:</b> {ride.destination?.address}</p>
          <p className="text-sm text-gray-500 mt-2">{ride.distanceKm} km · ETA ~{ride.durationMin} min</p>

          {/* Placeholder live map area - integrate @react-google-maps/api with driverLocation here */}
          <div className="mt-4 h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
            {driverLocation
              ? `Driver location: ${driverLocation.lat?.toFixed(4)}, ${driverLocation.lng?.toFixed(4)}`
              : 'Waiting for driver location...'}
          </div>
        </div>

        {ride.status === 'completed' && (
          <div className="card text-center">
            <h3 className="font-semibold text-gray-800 mb-3">Rate your ride</h3>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={28}
                  onClick={() => setRating(n)}
                  className={`cursor-pointer ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <button onClick={handleRate} className="btn-primary w-full max-w-xs">Submit Rating</button>
          </div>
        )}

        {!['completed', 'cancelled'].includes(ride.status) && (
          <button onClick={handleCancel} className="text-sm text-red-600 font-medium hover:underline">
            Cancel Ride
          </button>
        )}
      </div>

      <div className="space-y-4">
        {ride.driver && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Your Driver</h3>
            <p className="text-sm font-medium">{ride.driver.fullName}</p>
            <p className="text-xs text-gray-500">{ride.driver.vehicle?.brand} {ride.driver.vehicle?.model} · {ride.driver.vehicle?.number}</p>
            <p className="text-xs text-gray-500 mt-1">⭐ {ride.driver.rating}</p>
            <div className="flex gap-2 mt-4">
              <a href={`tel:${ride.driver.mobile}`} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                <Phone size={16} /> Call
              </a>
              <button onClick={handleSOS} className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-600 text-white rounded-lg py-2.5 font-semibold">
                <ShieldAlert size={16} /> SOS
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MessageCircle size={18} /> Chat with Driver
          </h3>
          <div className="h-40 overflow-y-auto space-y-2 mb-3 text-sm">
            {chatMessages.map((m, i) => (
              <p key={i} className={m.sender === 'customer' ? 'text-right text-primary-700' : 'text-left text-gray-700'}>
                {m.message}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input-field"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} className="btn-primary px-3">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideTracking;
