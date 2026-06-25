import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Car, Wallet as WalletIcon, History, Gift } from 'lucide-react';
import { rideApi, walletApi } from '../../api/rideApi';
import { setWallet } from '../../features/wallet/walletSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const wallet = useSelector((state) => state.wallet);
  const [recentRides, setRecentRides] = useState([]);

  useEffect(() => {
    walletApi.get().then(({ data }) => dispatch(setWallet(data.wallet))).catch(() => {});
    rideApi.getHistory({ limit: 5 }).then(({ data }) => setRecentRides(data.rides)).catch(() => {});
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/dashboard/book" className="card flex items-center gap-4 hover:shadow-md">
          <Car className="text-primary-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Quick action</p>
            <p className="font-semibold">Book a Ride</p>
          </div>
        </Link>
        <Link to="/dashboard/wallet" className="card flex items-center gap-4 hover:shadow-md">
          <WalletIcon className="text-primary-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Wallet Balance</p>
            <p className="font-semibold">₹{wallet.balance.toFixed(2)}</p>
          </div>
        </Link>
        <Link to="/dashboard/history" className="card flex items-center gap-4 hover:shadow-md">
          <History className="text-primary-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Trips</p>
            <p className="font-semibold">View History</p>
          </div>
        </Link>
      </div>

      <div className="card bg-primary-50 border-primary-100 flex items-center gap-3">
        <Gift className="text-primary-600" size={22} />
        <p className="text-sm text-primary-700">Use code <b>WELCOME50</b> to get 50% off your first ride!</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Trips</h3>
        {recentRides.length === 0 ? (
          <p className="text-sm text-gray-500">No rides yet. Book your first one!</p>
        ) : (
          <ul className="divide-y">
            {recentRides.map((r) => (
              <li key={r._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.pickup?.address} → {r.destination?.address}</p>
                  <p className="text-xs text-gray-500 capitalize">{r.status} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold">₹{r.fare?.final || r.fare?.estimated}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
