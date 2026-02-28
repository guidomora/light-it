import { Inject, Injectable } from '@nestjs/common';
import {
  PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL,
  PatientConfirmationEmailJobInput,
  PatientConfirmationNotificationChannel,
} from '../interfaces';

@Injectable()
export class SendPatientConfirmationNotificationUseCase {
  constructor(
    @Inject(PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL)
    private readonly patientConfirmationNotificationChannel: PatientConfirmationNotificationChannel,
  ) {}

  async sendPatientConfirmationNotification(
    patientConfirmationNotification: PatientConfirmationEmailJobInput,
  ): Promise<void> {
    await this.patientConfirmationNotificationChannel.sendPatientConfirmationNotification(
      patientConfirmationNotification,
    );
  }
}
