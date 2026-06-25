import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Clock, Star } from 'lucide-react';

const categories = [
  { name: 'Local Ride', desc: 'Quick city rides at your fingertips', emoji: '🚕' },
  { name: 'Rental', desc: 'Hourly rentals for full flexibility', emoji: '🚗' },
  { name: 'Airport Transfer', desc: 'On-time pickups & drop-offs', emoji: '✈️' },
  { name: 'Outstation', desc: 'Comfortable intercity travel', emoji: '🛣️' },
];

const reviews = [
  { name: 'Aisha R.', text: 'Booking was so smooth and the driver arrived in minutes!', rating: 5 },
  { name: 'Karthik M.', text: 'Transparent fares, no surprises. Highly recommend.', rating: 5 },
  { name: 'Priya S.', text: 'Used it for an airport drop — punctual and professional.', rating: 4 },
];

const faqs = [
  { q: 'How do I book a ride?', a: 'Simply enter your pickup and destination on the home page, choose a vehicle, and confirm.' },
  { q: 'What payment methods are accepted?', a: 'We support UPI, credit/debit cards, wallet balance, and cash.' },
  { q: 'How do I become a driver?', a: 'Click on "Become a Driver", register, and complete KYC verification.' },
];

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  const handleBook = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Your ride is just <span className="text-primary-600">one tap</span> away
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Safe, reliable, and affordable rides — anytime, anywhere. Book in seconds and track your driver live.
            </p>
          </div>

          {/* Ride Booking Widget */}
          <form onSubmit={handleBook} className="card max-w-md w-full ml-auto">
            <h3 className="font-semibold text-gray-800 mb-4">Book a ride now</h3>
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-primary-500" size={18} />
                <input
                  className="input-field pl-10"
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  className="input-field pl-10"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                See Prices
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <div key={c.name} className="card text-center hover:shadow-md transition">
              <div className="text-4xl mb-3">{c.emoji}</div>
              <h3 className="font-semibold text-gray-800">{c.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <ShieldCheck className="mx-auto text-primary-600 mb-3" size={36} />
            <h3 className="font-semibold text-gray-800">Safety First</h3>
            <p className="text-sm text-gray-500 mt-1">Verified drivers, live tracking, and SOS support.</p>
          </div>
          <div>
            <Clock className="mx-auto text-primary-600 mb-3" size={36} />
            <h3 className="font-semibold text-gray-800">Always On Time</h3>
            <p className="text-sm text-gray-500 mt-1">Real-time ETAs so you're never left waiting.</p>
          </div>
          <div>
            <Star className="mx-auto text-primary-600 mb-3" size={36} />
            <h3 className="font-semibold text-gray-800">Top-Rated Drivers</h3>
            <p className="text-sm text-gray-500 mt-1">Quality service backed by thousands of 5-star reviews.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Riders Say</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="card">
              <div className="flex gap-1 text-yellow-400 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-gray-600">"{r.text}"</p>
              <p className="mt-3 text-sm font-semibold text-gray-800">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download App */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Get the RideGo App</h2>
          <p className="text-primary-100 mb-6">Book rides on the go — available on iOS and Android.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-primary-700 font-semibold px-6 py-2.5 rounded-lg">App Store</button>
            <button className="bg-white text-primary-700 font-semibold px-6 py-2.5 rounded-lg">Google Play</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="card cursor-pointer">
              <summary className="font-semibold text-gray-800">{f.q}</summary>
              <p className="text-sm text-gray-600 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
