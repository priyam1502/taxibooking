import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Wallet as WalletIcon, Banknote } from 'lucide-react';
import { walletApi } from '../../api/rideApi';

const DriverWallet = () => {
  const [wallet, setWallet] = useState({ balance: 0, pendingBalance: 0, transactions: [] });
  const [amount, setAmount] = useState(0);

  const load = () => walletApi.get().then(({ data }) => setWallet(data.wallet)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleWithdraw = async () => {
    if (!amount || amount > wallet.pendingBalance) return toast.error('Enter a valid amount within your pending balance');
    try {
      await walletApi.withdraw(amount);
      toast.success('Withdrawal request submitted');
      setAmount(0);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card flex items-center gap-3 bg-primary-50 border-primary-100">
          <WalletIcon className="text-primary-600" size={30} />
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold">₹{wallet.balance?.toFixed(2)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Banknote className="text-yellow-600" size={30} />
          <div>
            <p className="text-sm text-gray-500">Pending Balance</p>
            <p className="text-2xl font-bold">₹{wallet.pendingBalance?.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">Request Withdrawal</h3>
        <div className="flex gap-3">
          <input type="number" className="input-field" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <button onClick={handleWithdraw} className="btn-primary whitespace-nowrap">Withdraw</button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Withdrawals are processed from your pending balance within 24-48 hours.</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Transactions</h3>
        {(!wallet.transactions || wallet.transactions.length === 0) ? (
          <p className="text-sm text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y">
            {wallet.transactions.slice().reverse().map((t, idx) => (
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

export default DriverWallet;
