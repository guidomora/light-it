import { PatientConfirmationEmailJobInput } from './patient-confirmation-email-job.input';

export const EMAIL_QUEUE_PUBLISHER = Symbol('EMAIL_QUEUE_PUBLISHER');

export interface EmailQueuePublisher {
  enqueuePatientConfirmationEmailJob(
    patientConfirmationEmailJob: PatientConfirmationEmailJobInput,
  ): Promise<void>;
}
