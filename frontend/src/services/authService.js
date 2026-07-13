import api from './api'

export const authService = {
  register: (data) => api.post('/api/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/api/auth/login', data).then((r) => r.data),
  me: () => api.get('/api/auth/me').then((r) => r.data),
  updateProfile: (data) => api.put('/api/auth/me', data).then((r) => r.data),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data).then((r) => r.data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data).then((r) => r.data),
}
