import api from '../axios';
import { LoginDto } from '../../types/dto.types';

export const loginApi = (data: LoginDto) => api.post('/auth/login', data);

export const registerPatientApi = (data: LoginDto) => api.post('/auth/create-patient', data);

export const registerDoctorApi = (data: LoginDto) => api.post('/auth/create-doctor', data);

export const getProfileApi = () => api.get('/auth/profile');
