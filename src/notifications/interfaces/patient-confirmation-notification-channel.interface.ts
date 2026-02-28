import { PatientConfirmationEmailJobInput } from './patient-confirmation-email-job.input';

export const PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL = Symbol(
  'PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL',
);

export interface PatientConfirmationNotificationChannel {
  sendPatientConfirmationNotification(
    patientConfirmationNotification:
      PatientConfirmationEmailJobInput,
  ): Promise<void>;
}
