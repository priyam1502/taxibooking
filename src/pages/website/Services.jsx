const services = [
  { name: 'Local Ride', desc: 'Affordable, quick rides within the city for your daily commute.', emoji: '🚕' },
  { name: 'Rental Ride', desc: 'Hire a car by the hour for multiple stops and full flexibility.', emoji: '🚗' },
  { name: 'Airport Transfer', desc: 'Reliable, on-time pickups and drop-offs for your flights.', emoji: '✈️' },
  { name: 'Outstation Ride', desc: 'Comfortable one-way or round-trip intercity travel.', emoji: '🛣️' },
];

const Services = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Services</h1>
    <div className="grid sm:grid-cols-2 gap-6">
      {services.map((s) => (
        <div key={s.name} className="card flex gap-4">
          <div className="text-4xl">{s.emoji}</div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{s.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Services;
