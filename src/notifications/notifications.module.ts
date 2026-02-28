import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullmqEmailQueuePublisher } from './adapters/bullmq-email-queue.publisher';
import { NodemailerEmailSenderAdapter } from './adapters/nodemailer-email-sender.adapter';
import { PATIENT_EMAIL_QUEUE_NAME } from './constants/patient-email.constants';
import { EMAIL_QUEUE_PUBLISHER } from './interfaces/email-queue-publisher.interface';
import { PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL } from './interfaces/patient-confirmation-notification-channel.interface';
import { PatientEmailProcessor } from './processors/patient-email.processor';
import { EnqueuePatientConfirmationEmailUseCase } from './use-cases/enqueue-patient-confirmation-email.use-case';
import { SendPatientConfirmationNotificationUseCase } from './use-cases/send-patient-confirmation-notification.use-case';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PATIENT_EMAIL_QUEUE_NAME,
    }),
  ],
  providers: [
    BullmqEmailQueuePublisher,
    NodemailerEmailSenderAdapter,
    PatientEmailProcessor,
    EnqueuePatientConfirmationEmailUseCase,
    SendPatientConfirmationNotificationUseCase,
    {
      provide: EMAIL_QUEUE_PUBLISHER,
      useExisting: BullmqEmailQueuePublisher,
    },
    {
      provide: PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL,
      useExisting: NodemailerEmailSenderAdapter,
    },
  ],
  exports: [EnqueuePatientConfirmationEmailUseCase],
})
export class NotificationsModule {}
