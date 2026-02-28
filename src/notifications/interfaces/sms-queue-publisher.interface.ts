import { PatientConfirmationSmsJobInput } from './patient-confirmation-sms-job.input';

export const SMS_QUEUE_PUBLISHER = Symbol('SMS_QUEUE_PUBLISHER');

export interface SmsQueuePublisher {
  enqueuePatientConfirmationSmsJob(
    patientConfirmationSmsJob: PatientConfirmationSmsJobInput,
  ): Promise<void>;
}
