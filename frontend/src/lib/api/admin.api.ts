import api from '../axios';
import { CreateOfficeDto, UpdateOfficeDto, CreateHospitalDto, UpdateHospitalDto } from '../../types/dto.types';

// Users
export const getAllUsersApi = () => api.get('/admin/users');
export const activateUserApi = (id: number) => api.patch(`/admin/users/${id}/activate`);
export const deactivateUserApi = (id: number) => api.patch(`/admin/users/${id}/deactivate`);

// Doctors
export const getAllDoctorsApi = () => api.get('/admin/doctors');
export const getPendingDoctorsApi = () => api.get('/admin/doctors/pending');
export const getDoctorByIdApi = (id: number) => api.get(`/admin/doctors/${id}`);
export const verifyDoctorApi = (id: number) => api.patch(`/admin/doctors/${id}/verify`);
export const viewDoctorDocumentApi = (doctorId: number, docId: number) =>
  api.get(`/admin/doctors/${doctorId}/documents/${docId}/view`, { responseType: 'arraybuffer' });

// Appointments
export const getAllAppointmentsApi = () => api.get('/admin/appointments');
export const getAppointmentByIdApi = (id: number) => api.get(`/admin/appointments/${id}`);

// Patients
export const getAllPatientsApi = () => api.get('/admin/patients');
export const getPatientByIdApi = (id: number) => api.get(`/admin/patients/${id}`);

// Specialization requests
export const getSpecializationRequestsApi = () => api.get('/admin/specialization-requests');
export const approveSpecializationApi = (doctorId: number, specializationId: number) =>
  api.post(`/admin/specialization-requests/${doctorId}/${specializationId}/approve`);
export const rejectSpecializationApi = (doctorId: number, specializationId: number) =>
  api.post(`/admin/specialization-requests/${doctorId}/${specializationId}/reject`);

// Offices
export const getAllOfficesApi = () => api.get('/admin/offices');
export const createOfficeApi = (dto: CreateOfficeDto) => api.post('/admin/offices', dto);
export const getOfficeByIdApi = (id: number) => api.get(`/admin/offices/${id}`);
export const updateOfficeApi = (id: number, dto: UpdateOfficeDto) => api.patch(`/admin/offices/${id}`, dto);
export const deleteOfficeApi = (id: number) => api.delete(`/admin/offices/${id}`);

// Hospitals
export const getHospitalsByOfficeApi = (officeId: number) =>
  api.get(`/admin/offices/${officeId}/hospitals`);
export const createHospitalApi = (officeId: number, dto: CreateHospitalDto) =>
  api.post(`/admin/offices/${officeId}/hospitals`, dto);
export const getHospitalByIdApi = (id: number) => api.get(`/admin/hospitals/${id}`);
export const updateHospitalApi = (id: number, dto: UpdateHospitalDto) =>
  api.patch(`/admin/hospitals/${id}`, dto);
export const deleteHospitalApi = (id: number) => api.delete(`/admin/hospitals/${id}`);

// Specializations
export const getAllSpecializationsApi = () => api.get('/admin/specialization-requests').then(() => ({ data: [] }));
