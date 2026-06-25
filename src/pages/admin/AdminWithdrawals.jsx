import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);

  const load = () => adminApi.getWithdrawals().then(({ data }) => setWithdrawals(data.withdrawals));

  useEffect(() => {
    load();
  }, []);

  const handleProcess = async (id, status) => {
    await adminApi.processWithdrawal(id, { status });
    toast.success(`Withdrawal marked as ${status}`);
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Withdrawal Requests</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Driver</th>
              <th>Amount</th>
              <th>Bank</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w._id} className="border-b last:border-0">
                <td className="py-3 font-medium">{w.driver?.fullName}</td>
                <td>₹{w.amount}</td>
                <td>{w.bankDetails?.bankName} ({w.bankDetails?.accountNumber})</td>
                <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[w.status]}`}>{w.status}</span></td>
                <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  {w.status === 'pending' && (
                    <>
                      <button onClick={() => handleProcess(w._id, 'approved')} className="text-xs font-semibold text-blue-600 hover:underline">Approve</button>
                      <button onClick={() => handleProcess(w._id, 'rejected')} className="text-xs font-semibold text-red-600 hover:underline">Reject</button>
                    </>
                  )}
                  {w.status === 'approved' && (
                    <button onClick={() => handleProcess(w._id, 'paid')} className="text-xs font-semibold text-green-600 hover:underline">Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-500 py-6">No withdrawal requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
