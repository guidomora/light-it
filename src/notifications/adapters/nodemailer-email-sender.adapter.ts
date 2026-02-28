import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { type Transporter } from 'nodemailer';
import { MailConfiguration } from '../interfaces/mail-configuration.interface';
import { PatientConfirmationEmailJobInput } from '../interfaces/patient-confirmation-email-job.input';
import { PatientConfirmationNotificationChannel } from '../interfaces/patient-confirmation-notification-channel.interface';

@Injectable()
export class NodemailerEmailSenderAdapter
  implements PatientConfirmationNotificationChannel
{
  private readonly mailConfiguration = this.getMailConfiguration();
  private readonly mailTransporter: Transporter = this.createMailTransporter();
  private readonly fromEmailAddress: string = this.mailConfiguration.mailFromAddress;

  async sendPatientConfirmationNotification(
    patientConfirmationNotification: PatientConfirmationEmailJobInput,
  ): Promise<void> {
    try {
      await this.mailTransporter.sendMail({
        from: this.fromEmailAddress,
        to: patientConfirmationNotification.patientEmailAddress,
        subject: 'Patient registration confirmation',
        text: `Hello ${patientConfirmationNotification.patientFullName}, your registration has been completed successfully.`,
      });
    } catch {
      throw new InternalServerErrorException(
        `Failed to send confirmation email for patient ${patientConfirmationNotification.patientId}.`,
      );
    }
  }

  private getMailConfiguration(): MailConfiguration {
    const mailProvider = process.env.MAIL_PROVIDER;
    const mailUser = process.env.MAIL_USER;
    const mailFromAddress = process.env.MAIL_FROM;
    const mailKey = process.env.MAIL_KEY;

    if (!mailProvider || !mailUser || !mailFromAddress || !mailKey) {
      throw new Error(
        'Missing mail configuration. Required env vars: MAIL_PROVIDER, MAIL_USER, MAIL_FROM, MAIL_KEY.',
      );
    }

    const normalizedMailProvider = mailProvider.toLowerCase();

    if (normalizedMailProvider !== 'gmail') {
      throw new Error(
        `MAIL_PROVIDER "${mailProvider}" is not supported. Expected "gmail".`,
      );
    }

    return {
      mailUser,
      mailFromAddress,
      mailKey,
    };
  }


  private createMailTransporter(): Transporter {
    const { mailUser, mailKey } = this.mailConfiguration;

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailUser,
        pass: mailKey,
      },
    });
  }
}
