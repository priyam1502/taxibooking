import api from './axiosClient';

export const rideApi = {
  calculateFare: (data) => api.post('/fare/calculate', data),
  create: (data) => api.post('/rides/create', data),
  getPending: () => api.get('/rides/pending'),
  accept: (rideId) => api.post('/rides/accept', { rideId }),
  reject: (rideId) => api.post('/rides/reject', { rideId }),
  start: (rideId, otp) => api.post('/rides/start', { rideId, otp }),
  end: (rideId) => api.post('/rides/end', { rideId }),
  cancel: (rideId, reason) => api.post('/rides/cancel', { rideId, reason }),
  getById: (id) => api.get(`/rides/${id}`),
  getHistory: (params) => api.get('/rides/history', { params }),
  rate: (id, data) => api.post(`/rides/${id}/rate`, data),
};

export const vehicleApi = {
  getAll: () => api.get('/vehicles'),
};

export const walletApi = {
  get: () => api.get('/wallet'),
  addMoney: (amount) => api.post('/wallet/add-money', { amount }),
  withdraw: (amount) => api.post('/wallet/withdraw', { amount }),
};

export const paymentApi = {
  create: (data) => api.post('/payment/create', data),
  verify: (data) => api.post('/payment/verify', data),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/change-password', data),
  addSavedLocation: (data) => api.post('/profile/saved-locations', data),
  removeSavedLocation: (id) => api.delete(`/profile/saved-locations/${id}`),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

export const supportApi = {
  createTicket: (data) => api.post('/support/tickets', data),
  getMyTickets: () => api.get('/support/tickets'),
  reply: (id, message) => api.post(`/support/tickets/${id}/reply`, { message }),
};

export const cmsApi = {
  getPage: (key) => api.get(`/cms/${key}`),
  getBanners: () => api.get('/cms/banners'),
};

export const couponApi = {
  validate: (code) => api.get(`/coupons/validate/${code}`),
};
