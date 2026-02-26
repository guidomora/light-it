import { Inject, Injectable } from '@nestjs/common';
import { PatientEntity } from '../entities/patient.entity';
import { CreatePatientDetailsInput } from '../interfaces/create-patient-details.input';
import {
  DOCUMENT_PHOTO_STORAGE,
  DocumentPhotoStorage,
} from '../interfaces/document-photo-storage.interface';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../interfaces/patient.repository.interface';
import { UploadedDocumentPhoto } from '../interfaces/uploaded-document-photo.interface';

@Injectable()
export class CreatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
    @Inject(DOCUMENT_PHOTO_STORAGE)
    private readonly documentPhotoStorage: DocumentPhotoStorage,
  ) {}

  async createPatient(
    patientRegistrationData: CreatePatientDetailsInput,
    uploadedDocumentPhoto: UploadedDocumentPhoto,
  ): Promise<PatientEntity> {
    const documentPhotoUrl =
      await this.documentPhotoStorage.uploadDocumentPhoto(
        uploadedDocumentPhoto,
      );

    return this.patientRepository.createPatient({
      ...patientRegistrationData,
      documentPhotoUrl,
    });
  }
}
