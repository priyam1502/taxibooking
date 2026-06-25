import { Routes, Route } from 'react-router-dom';

import WebsiteLayout from './layouts/WebsiteLayout';
import CustomerLayout from './layouts/CustomerLayout';
import DriverLayout from './layouts/DriverLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public website
import Home from './pages/website/Home';
import Services from './pages/website/Services';
import Contact from './pages/website/Contact';
import StaticPage from './pages/website/StaticPage';
import BecomeDriver from './pages/website/BecomeDriver';
import Corporate from './pages/website/Corporate';
import Blog from './pages/website/Blog';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Customer
import CustomerDashboard from './pages/customer/Dashboard';
import BookRide from './pages/customer/BookRide';
import RideTracking from './pages/customer/RideTracking';
import CustomerWallet from './pages/customer/Wallet';
import RideHistory from './pages/customer/RideHistory';
import Notifications from './pages/customer/Notifications';
import Support from './pages/customer/Support';
import Profile from './pages/customer/Profile';

// Driver
import DriverLogin from './pages/driver/DriverLogin';
import DriverRegister from './pages/driver/DriverRegister';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverRides from './pages/driver/DriverRides';
import DriverActiveRide from './pages/driver/DriverActiveRide';
import DriverWallet from './pages/driver/DriverWallet';
import DriverHistory from './pages/driver/DriverHistory';
import DriverProfile from './pages/driver/DriverProfile';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminRides from './pages/admin/AdminRides';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminCms from './pages/admin/AdminCms';
import AdminTickets from './pages/admin/AdminTickets';
import AdminReports from './pages/admin/AdminReports';

import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<StaticPage cmsKey="about_us" />} />
        <Route path="/services" element={<Services />} />
        <Route path="/become-driver" element={<BecomeDriver />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/privacy-policy" element={<StaticPage cmsKey="privacy_policy" />} />
        <Route path="/terms" element={<StaticPage cmsKey="terms_conditions" />} />
        <Route path="/faq" element={<StaticPage cmsKey="faq" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/register" element={<DriverRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* Customer dashboard (protected) */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/dashboard" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="book" element={<BookRide />} />
          <Route path="track/:rideId" element={<RideTracking />} />
          <Route path="wallet" element={<CustomerWallet />} />
          <Route path="history" element={<RideHistory />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Driver dashboard (protected) */}
      <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
        <Route path="/driver" element={<DriverLayout />}>
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="rides" element={<DriverRides />} />
          <Route path="active/:rideId" element={<DriverActiveRide />} />
          <Route path="wallet" element={<DriverWallet />} />
          <Route path="history" element={<DriverHistory />} />
          <Route path="profile" element={<DriverProfile />} />
        </Route>
      </Route>

      {/* Admin dashboard (protected) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="rides" element={<AdminRides />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="cms" element={<AdminCms />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
