import { AffiliateHospitalDto, CreatePrivatePracticeDto, GenerateTimeSlotsDto, MarkUnavailabilityDto, SetAvailabilityDto } from '@/types/dto.types';
import api from '../axios';


export const getDoctorProfileApi = () => api.get('/doctor-role/profile');
export const updateDoctorProfileApi = (dto: any) => api.patch('/doctor-role/profile', dto);
export const requestVerificationApi = () => api.patch('/doctor-role/request-verification');


export const setupProfileApi = (formData: FormData) =>
  api.post('/doctor-role/setup-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });


export const viewDocumentApi = (id: number) =>
  api.get(`/doctor-role/documents/${id}/view`, { responseType: 'arraybuffer' });


export const requestSpecializationApi = (specializationId: number, formData: FormData) =>
  api.post(`/doctor-role/request-specialization/${specializationId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });



export const setAvailabilityApi = (dto: SetAvailabilityDto) => api.post('/doctor-role/availability', dto);

export const getAvailabilityApi = (doctorHospitalId: number) =>
  api.get(`/doctor-role/availability/${doctorHospitalId}`);
export const deleteAvailabilityApi = (id: number) =>
  api.delete(`/doctor-role/availability/${id}`);

export const generateTimeSlotsApi = (dto: GenerateTimeSlotsDto) => api.post('/doctor-role/timeslots/generate', dto);
export const getTimeSlotsApi = (doctorHospitalId: number) =>
  api.get(`/doctor-role/timeslots/${doctorHospitalId}`);


export const markUnavailabilityApi = (dto: MarkUnavailabilityDto) => api.post('/doctor-role/unavailability', dto);



export const getDoctorAppointmentsApi = () => api.get('/doctor-role/appointments');
export const completeAppointmentApi = (id: number) =>
  api.patch(`/doctor-role/appointments/${id}/complete`);

export const createOfficeApi = (dto: CreatePrivatePracticeDto) => api.post('/doctor-role/office', dto);

export const getDoctorOfficesApi = () => api.get('/doctor-role/offices');
export const updatePracticeApi = (id: number, dto: any) =>
  api.patch(`/doctor-role/practices/${id}`, dto);
export const deletePracticeApi = (id: number) =>
  api.delete(`/doctor-role/practices/${id}`);


export const affiliateHospitalApi = (dto: AffiliateHospitalDto) => api.post('/doctor-role/affiliate', dto);


export const getInsurancesApi = (doctorHospitalId: number) =>
  api.get(`/in-network-insurance?doctorHospitalId=${doctorHospitalId}`);
export const addInsuranceApi = (dto: { doctorHospitalId: number; insuranceName: string }) =>
  api.post('/in-network-insurance', dto);
export const deleteInsuranceApi = (id: number) => api.delete(`/in-network-insurance/${id}`);

// Analytics
export const getDoctorAnalyticsApi = () => api.get('/doctor-role/analytics');
