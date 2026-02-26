import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { DocumentPhotoStorage } from '../interfaces/document-photo-storage.interface';
import { UploadedDocumentPhoto } from '../interfaces/uploaded-document-photo.interface';

@Injectable()
export class CloudinaryDocumentPhotoStorageAdapter implements DocumentPhotoStorage {
  constructor() {
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryApiKey = process.env.API_KEY;
    const cloudinaryApiSecret = process.env.API_SECRET;

    if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      throw new Error('Cloudinary configuration is incomplete.');
    }

    cloudinary.config({
      cloud_name: cloudinaryCloudName,
      api_key: cloudinaryApiKey,
      api_secret: cloudinaryApiSecret,
      secure: true,
    });
  }

  async uploadDocumentPhoto(
    documentPhotoFile: UploadedDocumentPhoto,
  ): Promise<string> {
    const documentPhotoDataUri = `data:${documentPhotoFile.mimetype};base64,${documentPhotoFile.buffer.toString('base64')}`;

    try {
      const uploadResult = await cloudinary.uploader.upload(
        documentPhotoDataUri,
        {
          folder: 'patients/documents',
          resource_type: 'image',
        },
      );

      return uploadResult.secure_url;
    } catch {
      throw new InternalServerErrorException(
        'Failed to upload patient document photo.',
      );
    }
  }
}
