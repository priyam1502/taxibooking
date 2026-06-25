import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Wallet as WalletIcon, Plus } from 'lucide-react';
import { walletApi } from '../../api/rideApi';
import { setWallet } from '../../features/wallet/walletSlice';

const Wallet = () => {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);
  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);

  const loadWallet = () => walletApi.get().then(({ data }) => dispatch(setWallet(data.wallet))).catch(() => {});

  useEffect(() => {
    loadWallet();
  }, []);

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      const { data } = await walletApi.addMoney(amount);
      dispatch(setWallet(data.wallet));
      toast.success('Money added to wallet');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="card flex items-center gap-4 bg-primary-50 border-primary-100">
        <WalletIcon className="text-primary-600" size={36} />
        <div>
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-3xl font-bold text-gray-900">₹{wallet.balance?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">Add Money</h3>
        <div className="flex gap-3 mb-3">
          {[100, 500, 1000, 2000].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                amount === amt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <button onClick={handleAddMoney} disabled={loading} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} /> {loading ? 'Adding...' : 'Add Money'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Transaction History</h3>
        {(!wallet.transactions || wallet.transactions.length === 0) ? (
          <p className="text-sm text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y">
            {wallet.transactions
              .slice()
              .reverse()
              .map((t, idx) => (
                <li key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">{t.reason?.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-sm font-semibold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Wallet;
