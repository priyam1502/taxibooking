import { useEffect, useState } from 'react';
import { rideApi } from '../../api/rideApi';

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  ongoing: 'bg-blue-100 text-blue-700',
  requested: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
};

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    rideApi
      .getHistory({ status: filter || undefined, page })
      .then(({ data }) => {
        setRides(data.rides);
        setPages(data.pages);
      })
      .catch(() => {});
  }, [filter, page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Ride History</h2>
        <select className="input-field w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Rides</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card">
        {rides.length === 0 ? (
          <p className="text-sm text-gray-500">No rides found.</p>
        ) : (
          <ul className="divide-y">
            {rides.map((r) => (
              <li key={r._id} className="py-4 flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {r.pickup?.address} → {r.destination?.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.createdAt).toLocaleString()} · {r.vehicleType?.name} · {r.distanceKm} km
                  </p>
                  {r.driver && <p className="text-xs text-gray-500">Driver: {r.driver.fullName}</p>}
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                    {r.status}
                  </span>
                  <p className="text-sm font-semibold mt-2">₹{r.fare?.final || r.fare?.estimated}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                page === p ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideHistory;
