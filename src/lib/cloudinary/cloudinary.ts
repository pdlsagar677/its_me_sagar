import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  // Upload Image
  async uploadImage(buffer: Buffer, folder: string = 'portfolio'): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  },

  // Upload PDF/Document - UPDATED FOR INLINE VIEWING
  async uploadDocument(buffer: Buffer, folder: string = 'portfolio'): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'raw', // Important: use 'raw' for PDFs and documents
          allowed_formats: ['pdf', 'doc', 'docx'],
          access_mode: 'public', // Ensure public access
          // No flags needed - Cloudinary serves PDFs inline by default
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  },

  // Delete Image
  async deleteImage(publicId: string): Promise<any> {
    try {
      // Try deleting as image first
      const imageResult = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
      
      if (imageResult.result === 'ok') {
        return imageResult;
      }
      
      // If not found as image, try as raw (for PDFs)
      const rawResult = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });
      
      return rawResult;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  },

  // Delete Document - NEW METHOD
  async deleteDocument(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });
  },
};