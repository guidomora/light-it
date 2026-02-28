import { Injectable, Logger } from '@nestjs/common';
import { PatientEntity } from '../../patients/entities/patient.entity';
import { NotificationChannel } from '../enums/notification-channel.enum';
import { EnqueuePatientConfirmationEmailUseCase } from '../use-cases/enqueue-patient-confirmation-email.use-case';
import { EnqueuePatientConfirmationSmsUseCase } from '../use-cases/enqueue-patient-confirmation-sms.use-case';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly enqueuePatientConfirmationEmailUseCase: EnqueuePatientConfirmationEmailUseCase,
    private readonly enqueuePatientConfirmationSmsUseCase: EnqueuePatientConfirmationSmsUseCase,
  ) {}

  async notifyPatientRegistration(patientEntity: PatientEntity): Promise<void> {
    
    await this.enqueueNotificationSafely(
      () =>
        this.enqueuePatientConfirmationEmailUseCase.enqueuePatientConfirmationEmail(
          patientEntity,
        ),
      patientEntity.id,
      NotificationChannel.EMAIL,
    );

    await this.enqueueNotificationSafely(
      () =>
        this.enqueuePatientConfirmationSmsUseCase.enqueuePatientConfirmationSms(
          patientEntity,
        ),
      patientEntity.id,
      NotificationChannel.SMS,
    );
  }

  private async enqueueNotificationSafely(
    enqueueNotification: () => Promise<void>,
    patientId: string,
    notificationChannel: NotificationChannel,
  ): Promise<void> {
    try {
      await enqueueNotification();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown queueing error.';

      this.logger.error(
        `Patient ${patientId} was created but ${notificationChannel} enqueue failed: ${errorMessage}`,
      );
    }
  }
}
