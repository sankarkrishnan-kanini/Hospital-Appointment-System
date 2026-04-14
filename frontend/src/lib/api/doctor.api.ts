import api from '../axios';

// Profile
export const getDoctorProfileApi = () => api.get('/doctor-role/profile');
export const updateDoctorProfileApi = (dto: any) => api.patch('/doctor-role/profile', dto);
export const requestVerificationApi = () => api.patch('/doctor-role/request-verification');

// Setup profile (multipart)
export const setupProfileApi = (formData: FormData) =>
  api.post('/doctor-role/setup-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Documents
export const downloadDocumentApi = (id: number) =>
  api.get(`/doctor-role/documents/${id}/download`, { responseType: 'blob' });

// Specialization request (multipart)
export const requestSpecializationApi = (specializationId: number, formData: FormData) =>
  api.post(`/doctor-role/request-specialization/${specializationId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Availability
export const setAvailabilityApi = (dto: any) => api.post('/doctor-role/availability', dto);
export const getAvailabilityApi = (doctorHospitalId: number) =>
  api.get(`/doctor-role/availability/${doctorHospitalId}`);
export const deleteAvailabilityApi = (id: number) =>
  api.delete(`/doctor-role/availability/${id}`);

// Time slots
export const generateTimeSlotsApi = (dto: any) => api.post('/doctor-role/timeslots/generate', dto);
export const getTimeSlotsApi = (doctorHospitalId: number) =>
  api.get(`/doctor-role/timeslots/${doctorHospitalId}`);

// Unavailability
export const markUnavailabilityApi = (dto: any) => api.post('/doctor-role/unavailability', dto);

// Appointments
export const getDoctorAppointmentsApi = () => api.get('/doctor-role/appointments');
export const completeAppointmentApi = (id: number) =>
  api.patch(`/doctor-role/appointments/${id}/complete`);

// Offices / Private practice
export const createOfficeApi = (dto: any) => api.post('/doctor-role/office', dto);
export const getDoctorOfficesApi = () => api.get('/doctor-role/offices');
export const updatePracticeApi = (id: number, dto: any) =>
  api.patch(`/doctor-role/practices/${id}`, dto);
export const deletePracticeApi = (id: number) =>
  api.delete(`/doctor-role/practices/${id}`);

// Hospital affiliation
export const affiliateHospitalApi = (dto: any) => api.post('/doctor-role/affiliate', dto);
