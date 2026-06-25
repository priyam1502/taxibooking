import api from './axiosClient';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const driverAuthApi = {
  register: (data) => api.post('/driver/register', data),
  login: (data) => api.post('/driver/login', data),
  uploadDoc: (field, formData) =>
    api.post(`/driver/upload-${field}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  dashboard: () => api.get('/driver/dashboard'),
  updateLocation: (data) => api.post('/driver/location', data),
};
