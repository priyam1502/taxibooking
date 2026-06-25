import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';

const AdminReports = () => {
  const [report, setReport] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = () => adminApi.getRevenueReport({ from: from || undefined, to: to || undefined }).then(({ data }) => setReport(data.report));

  useEffect(() => {
    load();
  }, []);

  const totalRevenue = report.reduce((sum, r) => sum + r.revenue, 0);
  const totalRides = report.reduce((sum, r) => sum + r.totalRides, 0);

  const exportCsv = () => {
    const rows = ['Date,Total Rides,Revenue', ...report.map((r) => `${r._id},${r.totalRides},${r.revenue}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-report.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-900">Revenue Reports</h2>
        <div className="flex gap-2 items-center">
          <input type="date" className="input-field" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" className="input-field" value={to} onChange={(e) => setTo(e.target.value)} />
          <button onClick={load} className="btn-primary">Filter</button>
          <button onClick={exportCsv} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600">Export CSV</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Revenue (selected period)</p>
          <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Completed Rides</p>
          <p className="text-2xl font-bold">{totalRides}</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Date</th>
              <th>Rides</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {report.map((r) => (
              <tr key={r._id} className="border-b last:border-0">
                <td className="py-3">{r._id}</td>
                <td>{r.totalRides}</td>
                <td>₹{r.revenue.toFixed(2)}</td>
              </tr>
            ))}
            {report.length === 0 && (
              <tr><td colSpan={3} className="text-center text-gray-500 py-6">No data for selected period.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
