import { PatientConfirmationEmailJobInput } from './patient-confirmation-email-job.input';

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');

export interface EmailSender {
  sendPatientConfirmationEmail(
    patientConfirmationEmailJob: PatientConfirmationEmailJobInput,
  ): Promise<void>;
}
