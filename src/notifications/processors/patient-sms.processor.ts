import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PATIENT_SMS_QUEUE_NAME } from '../constants/patient-sms.constants';
import { PatientConfirmationSmsJobInput } from '../interfaces';
import { SendPatientConfirmationSmsUseCase } from '../use-cases/send-patient-confirmation-sms.use-case';

@Processor(PATIENT_SMS_QUEUE_NAME)
export class PatientSmsProcessor extends WorkerHost {
  private readonly logger = new Logger(PatientSmsProcessor.name);

  constructor(
    private readonly sendPatientConfirmationSmsUseCase: SendPatientConfirmationSmsUseCase,
  ) {
    super();
  }

  async process(patientSmsJob: Job<PatientConfirmationSmsJobInput>): Promise<void> {
    await this.sendPatientConfirmationSmsUseCase.sendPatientConfirmationSms(
      patientSmsJob.data,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(
    failedSmsJob: Job<PatientConfirmationSmsJobInput> | undefined,
    error: Error,
  ): void {
    if (!failedSmsJob) {
      this.logger.error('A patient SMS job failed without job metadata.');
      return;
    }

    this.logger.error(
      `Patient SMS job ${failedSmsJob.id} failed for patient ${failedSmsJob.data.patientId}: ${error.message}`,
    );
  }
}
