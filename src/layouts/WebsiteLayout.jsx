import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Car } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/become-driver', label: 'Become a Driver' },
  { to: '/corporate', label: 'Corporate' },
  { to: '/contact', label: 'Contact' },
];

const WebsiteLayout = () => {
  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const dashboardPath = role === 'driver' ? '/driver/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <Car size={26} /> RideGo
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-primary-600 transition">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {token ? (
              <button onClick={() => navigate(dashboardPath)} className="btn-primary text-sm">
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-dark text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Car size={22} /> RideGo
            </div>
            <p className="text-sm text-gray-400">Book a ride anytime, anywhere. Fast, safe, and affordable.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/become-driver" className="hover:text-white">Become a Driver</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} RideGo. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
