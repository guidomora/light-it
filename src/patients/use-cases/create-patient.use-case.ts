import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { PatientEntity } from '../entities/patient.entity';
import {
  CreatePatientDetailsInput,
  DOCUMENT_PHOTO_STORAGE,
  DocumentPhotoStorage,
  PATIENT_REPOSITORY,
  PatientRepository,
  UploadedDocumentPhoto,
} from '../interfaces';

@Injectable()
export class CreatePatientUseCase {
  private readonly logger = new Logger(CreatePatientUseCase.name);

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
    @Inject(DOCUMENT_PHOTO_STORAGE)
    private readonly documentPhotoStorage: DocumentPhotoStorage,
    private readonly notificationsService: NotificationsService,
  ) { }

  async createPatient(
    patientRegistrationData: CreatePatientDetailsInput,
    uploadedDocumentPhoto: UploadedDocumentPhoto,
  ): Promise<PatientEntity> {
    const documentPhotoUrl = await this.documentPhotoStorage.uploadDocumentPhoto(
      uploadedDocumentPhoto,
    );

    const createdPatient = await this.patientRepository.createPatient({
      ...patientRegistrationData,
      documentPhotoUrl,
    });

    try {
      await this.notificationsService.notifyPatientRegistration(createdPatient);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown notification error.';

      this.logger.error(
        `Patient ${createdPatient.id} was created but notification dispatch failed: ${errorMessage}`,
      );
    }

    return createdPatient;
  }
}
