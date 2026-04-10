import api from '../axios';

// These endpoints are accessible by doctors to browse hospitals for affiliation
// Uses admin endpoints but doctor token has access via role guards
export const getOfficesForDoctorApi = () => api.get('/admin/offices');
export const getHospitalsForDoctorApi = (officeId: number) =>
  api.get(`/admin/offices/${officeId}/hospitals`);
