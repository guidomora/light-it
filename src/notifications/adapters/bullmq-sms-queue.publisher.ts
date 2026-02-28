import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  PATIENT_CONFIRMATION_SMS_JOB_NAME,
  PATIENT_SMS_QUEUE_NAME,
} from '../constants/patient-sms.constants';
import { PatientConfirmationSmsJobInput, SmsQueuePublisher } from '../interfaces';

@Injectable()
export class BullmqSmsQueuePublisher implements SmsQueuePublisher {
  constructor(
    @InjectQueue(PATIENT_SMS_QUEUE_NAME)
    private readonly patientSmsQueue: Queue<PatientConfirmationSmsJobInput>,
  ) {}

  async enqueuePatientConfirmationSmsJob(
    patientConfirmationSmsJob: PatientConfirmationSmsJobInput,
  ): Promise<void> {
    await this.patientSmsQueue.add(
      PATIENT_CONFIRMATION_SMS_JOB_NAME,
      patientConfirmationSmsJob,
      {
        jobId: `patient-confirmation-sms-${patientConfirmationSmsJob.patientId}`,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    );
  }
}
