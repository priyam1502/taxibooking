import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => adminApi.getUsers({ search, page }).then(({ data }) => {
    setUsers(data.users);
    setPages(data.pages);
  });

  useEffect(() => {
    load();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleBlock = async (id, blocked) => {
    await (blocked ? adminApi.unblockUser(id) : adminApi.blockUser(id));
    toast.success(blocked ? 'User unblocked' : 'User blocked');
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    await adminApi.deleteUser(id);
    toast.success('User deleted');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input className="input-field w-64" placeholder="Search by name, email, mobile" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="btn-primary px-3"><Search size={16} /></button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="py-3 font-medium">{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.mobile}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="flex gap-2 py-2">
                  <button onClick={() => handleBlock(u._id, u.isBlocked)} className="p-2 rounded-lg hover:bg-gray-100" title={u.isBlocked ? 'Unblock' : 'Block'}>
                    {u.isBlocked ? <CheckCircle size={16} className="text-green-600" /> : <Ban size={16} className="text-red-600" />}
                  </button>
                  <button onClick={() => handleDelete(u._id)} className="p-2 rounded-lg hover:bg-gray-100" title="Delete">
                    <Trash2 size={16} className="text-gray-500" />
                  </button>
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

export default AdminUsers;
