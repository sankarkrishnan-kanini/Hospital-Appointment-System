import api from '../axios';
import {
  CreateClientAccountDto,
  SearchDoctorsDto,
  BookAppointmentDto,
  CancelAppointmentDto,
  RescheduleAppointmentDto,
} from '../../types/dto.types';

export const createClientAccountApi = (dto: CreateClientAccountDto) => api.post('/patient/account', dto);
export const getClientAccountApi = () => api.get('/patient/account');
export const updateClientAccountApi = (dto: Partial<CreateClientAccountDto>) => api.patch('/patient/account', dto);

export const searchDoctorsApi = (params: SearchDoctorsDto) => api.get('/patient/doctors', { params });
export const getDoctorProfileApi = (id: number) => api.get(`/patient/doctors/${id}`);
export const getAvailableTimeSlotsApi = (id: number, doctorHospitalId: number) =>
  api.get(`/patient/doctors/${id}/timeslots`, { params: { doctorHospitalId } });

export const bookAppointmentApi = (dto: BookAppointmentDto) => api.post('/patient/appointments/book', dto);
export const cancelAppointmentApi = (id: number, dto: CancelAppointmentDto) =>
  api.patch(`/patient/appointments/${id}/cancel`, dto);
export const rescheduleAppointmentApi = (id: number, dto: RescheduleAppointmentDto) =>
  api.patch(`/patient/appointments/${id}/reschedule`, dto);
export const getPatientAppointmentsApi = () => api.get('/patient/appointments');
export const getAppointmentHistoryApi = (id: number) =>
  api.get(`/patient/appointments/${id}/history`);
export const getSpecializationsApi = () => api.get('/patient/specializations');
