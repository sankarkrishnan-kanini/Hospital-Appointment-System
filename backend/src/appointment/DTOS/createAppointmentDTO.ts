export class CreateAppointmentDto {
  userAccountId: number;
  officeId: number;
  timeSlotId: number;
  probableStartTime: Date;
  durationInMinutes: number;
  appointmentStatusId: number;
  appointmentTakenDate: Date;
}
