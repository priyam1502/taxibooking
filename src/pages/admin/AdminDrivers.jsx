import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-200 text-gray-700',
};

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => adminApi.getDrivers({ status: status || undefined, page }).then(({ data }) => {
    setDrivers(data.drivers);
    setPages(data.pages);
  });

  useEffect(() => {
    load();
  }, [status, page]);

  const handleAction = async (id, action) => {
    const fn = { approve: adminApi.approveDriver, reject: adminApi.rejectDriver, suspend: adminApi.suspendDriver }[action];
    await fn(id);
    toast.success(`Driver ${action}d`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Driver Management</h2>
        <select className="input-field w-48" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th>Mobile</th>
              <th>Vehicle</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d._id} className="border-b last:border-0">
                <td className="py-3 font-medium">{d.fullName}</td>
                <td>{d.mobile}</td>
                <td>{d.vehicle?.type || '—'}</td>
                <td>⭐ {d.rating}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[d.status]}`}>{d.status}</span>
                </td>
                <td className="py-2 space-x-2">
                  {d.status !== 'approved' && (
                    <button onClick={() => handleAction(d._id, 'approve')} className="text-xs font-semibold text-green-600 hover:underline">Approve</button>
                  )}
                  {d.status !== 'rejected' && (
                    <button onClick={() => handleAction(d._id, 'reject')} className="text-xs font-semibold text-red-600 hover:underline">Reject</button>
                  )}
                  {d.status !== 'suspended' && (
                    <button onClick={() => handleAction(d._id, 'suspend')} className="text-xs font-semibold text-gray-600 hover:underline">Suspend</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDrivers;
