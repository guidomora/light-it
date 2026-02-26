import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullmqEmailQueuePublisher } from './adapters/bullmq-email-queue.publisher';
import { NodemailerEmailSenderAdapter } from './adapters/nodemailer-email-sender.adapter';
import { PATIENT_EMAIL_QUEUE_NAME } from './constants/patient-email.constants';
import { EMAIL_QUEUE_PUBLISHER } from './interfaces/email-queue-publisher.interface';
import { EMAIL_SENDER } from './interfaces/email-sender.interface';
import { PatientEmailProcessor } from './processors/patient-email.processor';
import { EnqueuePatientConfirmationEmailUseCase } from './use-cases/enqueue-patient-confirmation-email.use-case';
import { SendPatientConfirmationEmailUseCase } from './use-cases/send-patient-confirmation-email.use-case';

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
    SendPatientConfirmationEmailUseCase,
    {
      provide: EMAIL_QUEUE_PUBLISHER,
      useExisting: BullmqEmailQueuePublisher,
    },
    {
      provide: EMAIL_SENDER,
      useExisting: NodemailerEmailSenderAdapter,
    },
  ],
  exports: [EnqueuePatientConfirmationEmailUseCase],
})
export class NotificationsModule {}
