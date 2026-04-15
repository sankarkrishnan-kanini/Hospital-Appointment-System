import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendWelcome(email: string, name: string, role: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Welcome to HospitalApp!',
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Your account has been created successfully as a <strong>${role}</strong>.</p>
        <p>You can now log in and start using the platform.</p>
      `,
    });
  }

  async sendAppointmentBookedToPatient(
    patientEmail: string,
    patientName: string,
    doctorName: string,
    hospital: string,
    date: Date,
    appointmentId: number,
    fee: number,
  ) {
    await this.mailer.sendMail({
      to: patientEmail,
      subject: `Appointment Confirmed — #${appointmentId}`,
      html: `
        <h2>Appointment Confirmed!</h2>
        <p>Hi ${patientName}, your appointment has been booked successfully.</p>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:480px">
          <tr><td><strong>Appointment ID</strong></td><td>#${appointmentId}</td></tr>
          <tr><td><strong>Doctor</strong></td><td>Dr. ${doctorName}</td></tr>
          <tr><td><strong>Hospital</strong></td><td>${hospital}</td></tr>
          <tr><td><strong>Date & Time</strong></td><td>${date.toUTCString()}</td></tr>
          <tr><td><strong>Consultation Fee</strong></td><td>₹${fee}</td></tr>
        </table>
        <p>Please arrive 10 minutes before your scheduled time.</p>
      `,
    });
  }

  async sendAppointmentBookedToDoctor(
    doctorEmail: string,
    doctorName: string,
    patientName: string,
    date: Date,
    appointmentId: number,
  ) {
    await this.mailer.sendMail({
      to: doctorEmail,
      subject: `New Appointment Booked — #${appointmentId}`,
      html: `
        <h2>New Appointment</h2>
        <p>Hi Dr. ${doctorName}, a new appointment has been booked.</p>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:480px">
          <tr><td><strong>Appointment ID</strong></td><td>#${appointmentId}</td></tr>
          <tr><td><strong>Patient</strong></td><td>${patientName}</td></tr>
          <tr><td><strong>Date & Time</strong></td><td>${date.toUTCString()}</td></tr>
        </table>
      `,
    });
  }

  async sendUnavailabilityCancellation(
    patientEmail: string,
    patientName: string,
    doctorName: string,
    slotTime: Date,
    isFullDay: boolean,
    reason?: string,
  ) {
    const timeLabel = isFullDay
      ? `the full day of ${slotTime.toUTCString().split(' ').slice(0, 4).join(' ')}`
      : slotTime.toUTCString();

    await this.mailer.sendMail({
      to: patientEmail,
      subject: `Appointment Cancelled — Doctor Unavailable`,
      html: `
        <h2>Appointment Cancelled</h2>
        <p>Hi ${patientName}, we regret to inform you that your appointment with Dr. ${doctorName} 
        scheduled for <strong>${timeLabel}</strong> has been cancelled because the doctor is 
        unavailable${isFullDay ? ' for the full day' : ' during that time slot'}.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>Please book a new appointment at your convenience.</p>
      `,
    });
  }
}
