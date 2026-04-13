import api from '../axios';

// These endpoints are accessible by doctors to browse hospitals for affiliation
export const getOfficesForDoctorApi = () => api.get('/admin/offices');
export const getHospitalsForDoctorApi = (officeId: number) =>
  api.get(`/admin/offices/${officeId}/hospitals`);

// Notifications
export const getNotificationsApi = () => api.get('/notifications');
export const markNotificationReadApi = (id: number) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsReadApi = () => api.patch('/notifications/read-all');
