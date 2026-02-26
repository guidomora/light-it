import { Inject, Injectable } from '@nestjs/common';
import {
  EMAIL_SENDER,
  EmailSender,
} from '../interfaces/email-sender.interface';
import { PatientConfirmationEmailJobInput } from '../interfaces/patient-confirmation-email-job.input';

@Injectable()
export class SendPatientConfirmationEmailUseCase {
  constructor(
    @Inject(EMAIL_SENDER)
    private readonly emailSender: EmailSender,
  ) {}

  async sendPatientConfirmationEmail(
    patientConfirmationEmailJob: PatientConfirmationEmailJobInput,
  ): Promise<void> {
    await this.emailSender.sendPatientConfirmationEmail(
      patientConfirmationEmailJob,
    );
  }
}
