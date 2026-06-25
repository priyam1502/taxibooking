import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificationApi } from '../../api/rideApi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const load = () => notificationApi.getAll().then(({ data }) => setNotifications(data.notifications)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleRead = async (id) => {
    await notificationApi.markRead(id);
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
      <div className="card">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="divide-y">
            {notifications.map((n) => (
              <li
                key={n._id}
                onClick={() => !n.isRead && handleRead(n._id)}
                className={`py-3 flex gap-3 cursor-pointer ${!n.isRead ? 'bg-primary-50/50' : ''}`}
              >
                <Bell size={18} className={n.isRead ? 'text-gray-400' : 'text-primary-600'} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
