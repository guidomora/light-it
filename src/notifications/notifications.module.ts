import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullmqEmailQueuePublisher } from './adapters/bullmq-email-queue.publisher';
import { BullmqSmsQueuePublisher } from './adapters/bullmq-sms-queue.publisher';
import { NodemailerEmailSenderAdapter } from './adapters/nodemailer-email-sender.adapter';
import { SmsSenderAdapter } from './adapters/sms-sender.adapter';
import { PATIENT_EMAIL_QUEUE_NAME } from './constants/patient-email.constants';
import { PATIENT_SMS_QUEUE_NAME } from './constants/patient-sms.constants';
import {
  EMAIL_QUEUE_PUBLISHER,
  PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL,
  SMS_QUEUE_PUBLISHER,
  SMS_SENDER,
} from './interfaces';
import { PatientEmailProcessor } from './processors/patient-email.processor';
import { PatientSmsProcessor } from './processors/patient-sms.processor';
import { NotificationsService } from './services/notifications.service';
import { EnqueuePatientConfirmationEmailUseCase } from './use-cases/enqueue-patient-confirmation-email.use-case';
import { EnqueuePatientConfirmationSmsUseCase } from './use-cases/enqueue-patient-confirmation-sms.use-case';
import { SendPatientConfirmationNotificationUseCase } from './use-cases/send-patient-confirmation-notification.use-case';
import { SendPatientConfirmationSmsUseCase } from './use-cases/send-patient-confirmation-sms.use-case';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PATIENT_EMAIL_QUEUE_NAME,
    }),
    BullModule.registerQueue({
      name: PATIENT_SMS_QUEUE_NAME,
    }),
  ],
  providers: [
    BullmqEmailQueuePublisher,
    BullmqSmsQueuePublisher,
    NodemailerEmailSenderAdapter,
    SmsSenderAdapter,
    PatientEmailProcessor,
    PatientSmsProcessor,
    NotificationsService,
    EnqueuePatientConfirmationEmailUseCase,
    EnqueuePatientConfirmationSmsUseCase,
    SendPatientConfirmationNotificationUseCase,
    SendPatientConfirmationSmsUseCase,
    {
      provide: EMAIL_QUEUE_PUBLISHER,
      useExisting: BullmqEmailQueuePublisher,
    },
    {
      provide: SMS_QUEUE_PUBLISHER,
      useExisting: BullmqSmsQueuePublisher,
    },
    {
      provide: PATIENT_CONFIRMATION_NOTIFICATION_CHANNEL,
      useExisting: NodemailerEmailSenderAdapter,
    },
    {
      provide: SMS_SENDER,
      useExisting: SmsSenderAdapter,
    },
  ],
  exports: [
    NotificationsService,
    EnqueuePatientConfirmationEmailUseCase,
    EnqueuePatientConfirmationSmsUseCase,
    SMS_SENDER,
  ],
})
export class NotificationsModule {}
