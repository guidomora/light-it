import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PATIENT_EMAIL_QUEUE_NAME } from '../constants/patient-email.constants';
import { PatientConfirmationEmailJobInput } from '../interfaces/patient-confirmation-email-job.input';
import { SendPatientConfirmationNotificationUseCase } from '../use-cases/send-patient-confirmation-notification.use-case';

@Processor(PATIENT_EMAIL_QUEUE_NAME)
export class PatientEmailProcessor extends WorkerHost {
  private readonly logger = new Logger(PatientEmailProcessor.name);

  constructor(
    private readonly sendPatientConfirmationNotificationUseCase: SendPatientConfirmationNotificationUseCase,
  ) {
    super();
  }

  async process(
    patientEmailJob: Job<PatientConfirmationEmailJobInput>,
  ): Promise<void> {
    await this.sendPatientConfirmationNotificationUseCase.sendPatientConfirmationNotification(
      patientEmailJob.data,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(
    failedEmailJob: Job<PatientConfirmationEmailJobInput> | undefined,
    error: Error,
  ): void {
    if (!failedEmailJob) {
      this.logger.error('A patient email job failed without job metadata.');
      return;
    }

    this.logger.error(
      `Patient email job ${failedEmailJob.id} failed for patient ${failedEmailJob.data.patientId}: ${error.message}`,
    );
  }
}
