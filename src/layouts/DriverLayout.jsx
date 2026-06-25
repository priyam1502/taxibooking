import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Home, Navigation, Wallet, History, User, LogOut } from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const links = [
  { to: '/driver/dashboard', label: 'Dashboard', icon: Home },
  { to: '/driver/rides', label: 'Ride Requests', icon: Navigation },
  { to: '/driver/wallet', label: 'Wallet', icon: Wallet },
  { to: '/driver/history', label: 'Trip History', icon: History },
  { to: '/driver/profile', label: 'Profile & KYC', icon: User },
];

const DriverLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/driver/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-xl text-primary-600 border-b">RideGo Driver</div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/driver/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 border-t"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="font-semibold text-gray-800">Welcome, {profile?.fullName || 'Driver'}</h1>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              profile?.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {profile?.status || 'pending'}
          </span>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
