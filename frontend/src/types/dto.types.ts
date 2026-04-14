

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateOfficeDto {
  name: string;
  city: string;
  state: string;
  country: string;
}

export type UpdateOfficeDto = Partial<CreateOfficeDto>;



export interface CreateHospitalDto {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  defaultFirstConsultationFee?: number;
  defaultFollowupFee?: number;
}

export type UpdateHospitalDto = Partial<CreateHospitalDto>;



export interface QualificationDto {
  qualificationName: string;
  instituteName: string;
  procurementYear?: string;
}

export interface HospitalAffiliationDto {
  hospitalName: string;
  city: string;
  country: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateDoctorProfileDto {
  firstName?: string;
  lastName?: string;
  professionalStatement?: string;
  practicingFrom?: string;
}



export interface CreatePrivatePracticeDto {
  timeSlotPerClientInMin: number;
  firstConsultationFee: number;
  followupConsultationFee: number;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export type UpdatePrivatePracticeDto = Partial<CreatePrivatePracticeDto>;

export interface AffiliateHospitalDto {
  hospitalId: number;
  firstConsultationFee: number;
  followupConsultationFee: number;
  timeSlotPerClientInMin: number;
}


export interface SetAvailabilityDto {
  doctorHospitalId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface GenerateTimeSlotsDto {
  doctorHospitalId: number;
  date: string;
}

export interface MarkUnavailabilityDto {
  date: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}


export interface CreateClientAccountDto {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
}

export interface SearchDoctorsDto {
  specializationId?: number;
  city?: string;
  maxFee?: number;
}

export interface BookAppointmentDto {
  specializationId: number;
  doctorId: number;
  doctorHospitalId: number;
  timeSlotId: number;
  reason?: string;
}

export interface CancelAppointmentDto {
  reason: string;
}

export interface RescheduleAppointmentDto {
  newTimeSlotId: number;
}
