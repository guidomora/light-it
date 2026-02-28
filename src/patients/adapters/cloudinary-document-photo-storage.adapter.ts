import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { DocumentPhotoStorage, UploadedDocumentPhoto } from '../interfaces';

@Injectable()
export class CloudinaryDocumentPhotoStorageAdapter implements DocumentPhotoStorage {
  private readonly cloudinaryConfiguration = this.getCloudinaryConfiguration();
  private readonly cloudinaryClient = this.createCloudinaryClient();

  async uploadDocumentPhoto(
    documentPhotoFile: UploadedDocumentPhoto,
  ): Promise<string> {
    const documentPhotoDataUri = `data:${documentPhotoFile.mimetype};base64,${documentPhotoFile.buffer.toString('base64')}`;

    try {
      const uploadResult = await this.cloudinaryClient.uploader.upload(
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

  private getCloudinaryConfiguration() {
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryApiKey = process.env.API_KEY;
    const cloudinaryApiSecret = process.env.API_SECRET;

    if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      throw new Error('Cloudinary configuration is incomplete.');
    }

    return {
      cloud_name: cloudinaryCloudName,
      api_key: cloudinaryApiKey,
      api_secret: cloudinaryApiSecret,
      secure: true,
    };
  }

  private createCloudinaryClient() {
    cloudinary.config(this.cloudinaryConfiguration);
    return cloudinary;
  }
}
