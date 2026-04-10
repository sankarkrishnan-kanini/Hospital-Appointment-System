import api from '../axios';

export const loginApi = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const registerPatientApi = (data: { email: string; password: string }) =>
  api.post('/auth/create-patient', data);

export const registerDoctorApi = (data: { email: string; password: string }) =>
  api.post('/auth/create-doctor', data);

export const getProfileApi = () => api.get('/auth/profile');
