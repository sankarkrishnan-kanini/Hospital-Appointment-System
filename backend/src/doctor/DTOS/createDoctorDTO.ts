export class CreateDoctorDto {
  userId: number;
  firstName: string;
  lastName: string;
  professionalStatement?: string;
  practicingFrom?: Date;
  isVerified?: boolean;
}
