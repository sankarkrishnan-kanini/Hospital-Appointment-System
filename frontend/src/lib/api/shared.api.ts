import api from '../axios';


export const getOfficesForDoctorApi = () => api.get('/admin/offices');
export const getHospitalsForDoctorApi = (officeId: number) =>
  api.get(`/admin/offices/${officeId}/hospitals`);


export const getNotificationsApi = () => api.get('/notifications');
export const markNotificationReadApi = (id: number) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsReadApi = () => api.patch('/notifications/read-all');
