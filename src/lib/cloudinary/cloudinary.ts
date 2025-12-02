import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export const cloudinaryService = {
  // Upload image to Cloudinary
  async uploadImage(file: Buffer | string, folder: string = 'blog-posts'): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(
        typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 630, crop: 'limit' },
            { quality: 'auto' },
            { format: 'webp' }
          ]
        }
      );

      return result;
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  },

  // Delete image from Cloudinary
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  },

  // Extract public ID from Cloudinary URL
  getPublicIdFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split('.')[0];
      const folderParts = urlParts.slice(urlParts.indexOf('upload') + 1, -1);
      
      if (folderParts.length > 0) {
        return `${folderParts.join('/')}/${publicId}`;
      }
      
      return publicId;
    } catch (error) {
      console.error('❌ Error extracting public ID:', error);
      return null;
    }
  }
};