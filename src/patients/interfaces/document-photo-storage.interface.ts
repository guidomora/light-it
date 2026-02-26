import { UploadedDocumentPhoto } from './uploaded-document-photo.interface';

export const DOCUMENT_PHOTO_STORAGE = Symbol('DOCUMENT_PHOTO_STORAGE');

export interface DocumentPhotoStorage {
  uploadDocumentPhoto(
    documentPhotoFile: UploadedDocumentPhoto,
  ): Promise<string>;
}
