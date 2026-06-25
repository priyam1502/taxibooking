import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LifeBuoy, Send } from 'lucide-react';
import { supportApi } from '../../api/rideApi';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [form, setForm] = useState({ subject: '', category: 'general', message: '' });
  const [reply, setReply] = useState('');

  const loadTickets = () => supportApi.getMyTickets().then(({ data }) => setTickets(data.tickets)).catch(() => {});

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await supportApi.createTicket(form);
      toast.success('Ticket raised successfully');
      setForm({ subject: '', category: 'general', message: '' });
      loadTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to raise ticket');
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    const { data } = await supportApi.reply(activeTicket._id, reply);
    setActiveTicket(data.ticket);
    setReply('');
    loadTickets();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <LifeBuoy size={18} /> Raise a Ticket
        </h3>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            className="input-field"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="general">General</option>
            <option value="payment">Payment</option>
            <option value="ride">Ride Issue</option>
            <option value="account">Account</option>
          </select>
          <textarea
            className="input-field"
            rows={4}
            placeholder="Describe your issue..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary w-full">Submit Ticket</button>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">My Tickets</h3>
        {tickets.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets raised yet.</p>
        ) : (
          <ul className="divide-y mb-4">
            {tickets.map((t) => (
              <li
                key={t._id}
                onClick={() => setActiveTicket(t)}
                className={`py-3 cursor-pointer ${activeTicket?._id === t._id ? 'bg-primary-50' : ''}`}
              >
                <p className="text-sm font-medium text-gray-800">{t.subject}</p>
                <p className="text-xs text-gray-500 capitalize">{t.status} · {t.category}</p>
              </li>
            ))}
          </ul>
        )}

        {activeTicket && (
          <div className="border-t pt-4">
            <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
              {activeTicket.messages.map((m, i) => (
                <div key={i} className={`text-sm p-2 rounded-lg ${m.sender === 'admin' ? 'bg-primary-50 text-left' : 'bg-gray-100 text-right'}`}>
                  <p>{m.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input-field"
                placeholder="Type a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button onClick={handleReply} className="btn-primary px-3">
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
