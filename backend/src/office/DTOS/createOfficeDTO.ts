export class CreateOfficeDto {
  doctorId: number;
  hospitalAffiliationId?: number;
  timeSlotPerClientInMin: number;
  firstConsultationFee: number;
  followupConsultationFee: number;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
