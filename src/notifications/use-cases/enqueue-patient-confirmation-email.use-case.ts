import { Inject, Injectable } from '@nestjs/common';
import { PatientEntity } from '../../patients/entities/patient.entity';
import {
  EMAIL_QUEUE_PUBLISHER,
  EmailQueuePublisher,
} from '../interfaces/email-queue-publisher.interface';

@Injectable()
export class EnqueuePatientConfirmationEmailUseCase {
  constructor(
    @Inject(EMAIL_QUEUE_PUBLISHER)
    private readonly emailQueuePublisher: EmailQueuePublisher,
  ) {}

  async enqueuePatientConfirmationEmail(
    patientEntity: PatientEntity,
  ): Promise<void> {
    await this.emailQueuePublisher.enqueuePatientConfirmationEmailJob({
      patientId: patientEntity.id,
      patientFullName: patientEntity.fullName,
      patientEmailAddress: patientEntity.emailAddress,
    });
  }
}
