import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  PATIENT_CONFIRMATION_EMAIL_JOB_NAME,
  PATIENT_EMAIL_QUEUE_NAME,
} from '../constants/patient-email.constants';
import {
  EmailQueuePublisher,
  PatientConfirmationEmailJobInput,
} from '../interfaces';

@Injectable()
export class BullmqEmailQueuePublisher implements EmailQueuePublisher {
  constructor(
    @InjectQueue(PATIENT_EMAIL_QUEUE_NAME)
    private readonly patientEmailQueue: Queue<PatientConfirmationEmailJobInput>,
  ) {}

  async enqueuePatientConfirmationEmailJob(
    patientConfirmationEmailJob: PatientConfirmationEmailJobInput,
  ): Promise<void> {
    await this.patientEmailQueue.add(
      PATIENT_CONFIRMATION_EMAIL_JOB_NAME,
      patientConfirmationEmailJob,
      {
        jobId: `patient-confirmation-email-${patientConfirmationEmailJob.patientId}`,
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
