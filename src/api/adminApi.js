import api from './axiosClient';

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),

  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/admin/users/${id}/unblock`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getDrivers: (params) => api.get('/admin/drivers', { params }),
  approveDriver: (id) => api.put(`/admin/drivers/${id}/approve`),
  rejectDriver: (id) => api.put(`/admin/drivers/${id}/reject`),
  suspendDriver: (id) => api.put(`/admin/drivers/${id}/suspend`),

  getActiveRides: (params) => api.get('/admin/rides/active', { params }),
  getCompletedRides: (params) => api.get('/admin/rides/completed', { params }),
  getCancelledRides: (params) => api.get('/admin/rides/cancelled', { params }),

  getVehicles: () => api.get('/admin/vehicles'),
  createVehicle: (data) => api.post('/admin/vehicles', data),
  updateVehicle: (id, data) => api.put(`/admin/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/admin/vehicles/${id}`),

  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),

  upsertCms: (key, data) => api.put(`/admin/cms/${key}`, data),
  createBanner: (data) => api.post('/admin/banners', data),
  updateBanner: (id, data) => api.put(`/admin/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),

  getWithdrawals: () => api.get('/admin/withdrawals'),
  processWithdrawal: (id, data) => api.put(`/admin/withdrawals/${id}`, data),

  getTickets: (params) => api.get('/admin/tickets', { params }),

  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
};
