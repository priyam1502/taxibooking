import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { supportApi } from '../../api/rideApi';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('');
  const [active, setActive] = useState(null);
  const [reply, setReply] = useState('');

  const load = () => adminApi.getTickets({ raisedByType: filter || undefined }).then(({ data }) => setTickets(data.tickets));

  useEffect(() => {
    load();
  }, [filter]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    const { data } = await supportApi.reply(active._id, reply);
    setActive(data.ticket);
    setReply('');
    load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Support Tickets</h3>
          <select className="input-field w-40" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="User">Customers</option>
            <option value="Driver">Drivers</option>
          </select>
        </div>
        <ul className="divide-y">
          {tickets.map((t) => (
            <li key={t._id} onClick={() => setActive(t)} className={`py-3 cursor-pointer ${active?._id === t._id ? 'bg-primary-50' : ''}`}>
              <p className="text-sm font-medium text-gray-800">{t.subject}</p>
              <p className="text-xs text-gray-500 capitalize">{t.raisedByType} · {t.status} · {t.category}</p>
            </li>
          ))}
          {tickets.length === 0 && <p className="text-sm text-gray-500 py-4">No tickets found.</p>}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Conversation</h3>
        {!active ? (
          <p className="text-sm text-gray-500">Select a ticket to view conversation.</p>
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto space-y-2 mb-3">
              {active.messages.map((m, i) => (
                <div key={i} className={`text-sm p-2 rounded-lg max-w-[80%] ${m.sender === 'admin' ? 'bg-primary-600 text-white ml-auto' : 'bg-gray-100'}`}>
                  <p>{m.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input-field" placeholder="Type a reply..." value={reply} onChange={(e) => setReply(e.target.value)} />
              <button onClick={handleReply} className="btn-primary px-4">Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
