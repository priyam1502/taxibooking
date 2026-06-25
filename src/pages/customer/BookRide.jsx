import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import { rideApi, vehicleApi, couponApi } from '../../api/rideApi';

/**
 * NOTE ON MAPS: This uses simple lat/lng fields for pickup & destination.
 * To wire up full Google Maps autocomplete + route drawing, swap these
 * inputs for the @react-google-maps/api <Autocomplete> + <GoogleMap> components
 * and set VITE_GOOGLE_MAPS_API_KEY in your .env.
 */
const BookRide = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pickup, setPickup] = useState({ address: '', lat: '', lng: '' });
  const [destination, setDestination] = useState({ address: '', lat: '', lng: '' });
  const [rideType, setRideType] = useState('local');
  const [couponCode, setCouponCode] = useState('');
  const [fare, setFare] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    vehicleApi.getAll().then(({ data }) => setVehicles(data.vehicles)).catch(() => {});
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    navigator.geolocation.getCurrentPosition((pos) => {
      setPickup((p) => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude, address: p.address || 'My Location' }));
    });
  };

  const handleEstimate = async () => {
    if (!selectedVehicle) return toast.error('Select a vehicle first');
    if (!pickup.lat || !destination.lat) return toast.error('Enter valid pickup & destination coordinates');

    try {
      const { data } = await rideApi.calculateFare({
        vehicleTypeId: selectedVehicle._id,
        pickup,
        destination,
        rideType,
        couponCode,
      });
      setFare(data);
      toast.success('Fare estimated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not calculate fare');
    }
  };

  const handleBook = async () => {
    if (!fare) return toast.error('Get fare estimate first');
    setLoading(true);
    try {
      const { data } = await rideApi.create({
        vehicleTypeId: selectedVehicle._id,
        pickup,
        destination,
        rideType,
        paymentMethod,
        couponCode,
      });
      toast.success('Ride requested! Looking for nearby drivers...');
      navigate(`/dashboard/track/${data.ride._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card space-y-4">
        <h3 className="font-semibold text-gray-800">Where are you going?</h3>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-primary-500" size={18} />
          <input
            className="input-field pl-10"
            placeholder="Pickup address"
            value={pickup.address}
            onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input-field"
            placeholder="Pickup latitude"
            value={pickup.lat}
            onChange={(e) => setPickup({ ...pickup, lat: parseFloat(e.target.value) })}
          />
          <input
            className="input-field"
            placeholder="Pickup longitude"
            value={pickup.lng}
            onChange={(e) => setPickup({ ...pickup, lng: parseFloat(e.target.value) })}
          />
        </div>
        <button type="button" onClick={useMyLocation} className="text-xs text-primary-600 hover:underline">
          Use my current location
        </button>

        <div className="relative pt-2">
          <MapPin className="absolute left-3 top-5 text-gray-400" size={18} />
          <input
            className="input-field pl-10"
            placeholder="Destination address"
            value={destination.address}
            onChange={(e) => setDestination({ ...destination, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input-field"
            placeholder="Destination latitude"
            value={destination.lat}
            onChange={(e) => setDestination({ ...destination, lat: parseFloat(e.target.value) })}
          />
          <input
            className="input-field"
            placeholder="Destination longitude"
            value={destination.lng}
            onChange={(e) => setDestination({ ...destination, lng: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Ride Type</label>
          <select className="input-field mt-1" value={rideType} onChange={(e) => setRideType(e.target.value)}>
            <option value="local">Local Ride</option>
            <option value="rental">Rental</option>
            <option value="airport">Airport Transfer</option>
            <option value="outstation">Outstation</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Choose a vehicle</label>
          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            {vehicles.map((v) => (
              <button
                key={v._id}
                type="button"
                onClick={() => setSelectedVehicle(v)}
                className={`border rounded-lg p-3 text-left transition ${
                  selectedVehicle?._id === v._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <p className="font-medium text-gray-800">{v.name}</p>
                <p className="text-xs text-gray-500">Base ₹{v.baseFare} + ₹{v.perKmRate}/km · up to {v.capacity} seats</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Coupon code (optional)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            type="button"
            onClick={() => couponApi.validate(couponCode).then(() => toast.success('Coupon applied')).catch(() => toast.error('Invalid coupon'))}
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium"
          >
            Apply
          </button>
        </div>

        <button type="button" onClick={handleEstimate} className="btn-primary w-full">
          Get Fare Estimate
        </button>
      </div>

      <div className="card h-fit">
        <h3 className="font-semibold text-gray-800 mb-4">Trip Summary</h3>
        {fare ? (
          <div className="space-y-2 text-sm">
            <p className="flex justify-between"><span>Distance</span><span>{fare.distanceKm} km</span></p>
            <p className="flex justify-between"><span>Duration</span><span>{fare.durationMin} min</span></p>
            <hr />
            <p className="flex justify-between"><span>Base Fare</span><span>₹{fare.fare.breakdown.baseFare}</span></p>
            <p className="flex justify-between"><span>Distance Fare</span><span>₹{fare.fare.breakdown.distanceFare}</span></p>
            {fare.fare.breakdown.nightCharge > 0 && (
              <p className="flex justify-between"><span>Night Charge</span><span>₹{fare.fare.breakdown.nightCharge}</span></p>
            )}
            {fare.fare.breakdown.airportCharge > 0 && (
              <p className="flex justify-between"><span>Airport Charge</span><span>₹{fare.fare.breakdown.airportCharge}</span></p>
            )}
            {fare.fare.breakdown.discount > 0 && (
              <p className="flex justify-between text-green-600"><span>Discount</span><span>-₹{fare.fare.breakdown.discount}</span></p>
            )}
            <p className="flex justify-between"><span>Tax</span><span>₹{fare.fare.breakdown.tax}</span></p>
            <hr />
            <p className="flex justify-between font-bold text-base"><span>Total</span><span>₹{fare.fare.estimated}</span></p>

            <div className="pt-3">
              <label className="text-sm font-medium text-gray-700">Payment Method</label>
              <select className="input-field mt-1" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>

            <button onClick={handleBook} disabled={loading} className="btn-primary w-full mt-3">
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Select a vehicle and get a fare estimate to see your trip summary.</p>
        )}
      </div>
    </div>
  );
};

export default BookRide;
