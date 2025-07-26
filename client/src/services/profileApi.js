import api from './api';

export const getUserProfile = () => api.get('/profile');
export const updateUserInfo = (data) => api.put('/profile/update-info', data);
export const updateEmail = (email) => api.put('/profile/update-email', { email });
export const updatePassword = (data) => api.put('/profile/update-password', data);
export const updateBanking = (data) => api.put('/profile/update-banking', data);
