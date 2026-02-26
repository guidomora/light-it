import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';
import { EmailSender } from '../interfaces/email-sender.interface';
import { PatientConfirmationEmailJobInput } from '../interfaces/patient-confirmation-email-job.input';

@Injectable()
export class NodemailerEmailSenderAdapter implements EmailSender {
  private readonly mailTransporter: Transporter;
  private readonly fromEmailAddress: string;

  constructor() {
    const mailHost = process.env.MAIL_HOST ?? 'localhost';
    const mailPort = Number(process.env.MAIL_PORT ?? 1025);
    const mailSecureTransport =
      (process.env.MAIL_SECURE ?? 'false').toLowerCase() === 'true';
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_PASSWORD;
    const mailFromAddress =
      process.env.MAIL_FROM ?? 'no-reply@lightit-challenge.local';

    if (Number.isNaN(mailPort)) {
      throw new Error('MAIL_PORT must be a valid number.');
    }

    if ((mailUser && !mailPassword) || (!mailUser && mailPassword)) {
      throw new Error('MAIL_USER and MAIL_PASSWORD must be provided together.');
    }

    this.mailTransporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailSecureTransport,
      auth:
        mailUser && mailPassword
          ? {
              user: mailUser,
              pass: mailPassword,
            }
          : undefined,
    });

    this.fromEmailAddress = mailFromAddress;
  }

  async sendPatientConfirmationEmail(
    patientConfirmationEmailJob: PatientConfirmationEmailJobInput,
  ): Promise<void> {
    try {
      await this.mailTransporter.sendMail({
        from: this.fromEmailAddress,
        to: patientConfirmationEmailJob.patientEmailAddress,
        subject: 'Patient registration confirmation',
        text: `Hello ${patientConfirmationEmailJob.patientFullName}, your registration has been completed successfully.`,
      });
    } catch {
      throw new InternalServerErrorException(
        `Failed to send confirmation email for patient ${patientConfirmationEmailJob.patientId}.`,
      );
    }
  }
}
