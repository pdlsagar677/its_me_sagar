import { connectToDatabase } from './connection';
import { ObjectId } from 'mongodb';
import { cloudinaryService } from '@/lib/cloudinary/cloudinary';

export interface Profile {
  _id?: ObjectId;
  id: string;
  
  // Basic Information
  fullName: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  bio: string;
  
  // Media (Cloudinary URLs and IDs)
  profileImage: string;
  profileImagePublicId: string;
  coverImage: string;
  coverImagePublicId: string;
  cvUrl: string;
  cvPublicId: string;
  
  // Social Links
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    website: string;
    youtube: string;
    dribbble: string;
    behance: string;
    medium: string;
    stackoverflow: string;
  };
  
  // Experience
  experience: {
    years: number;
    title: string;
    description: string;
    projectsCompleted: number;
    clientsCount: number;
    companies: {
      name: string;
      position: string;
      duration: string;
      description: string;
    }[];
  };
  
  // Skills & Technologies
  technologies: string[];
  skills: {
    category: string;
    items: string[];
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
  
  // Education
  education: {
    degree: string;
    institution: string;
    year: string;
    description: string;
  }[];
  
  // Certifications
  certifications: {
    name: string;
    issuer: string;
    year: string;
    url: string;
  }[];
  
  // Stats
  stats: {
    postsCount: number;
    projectsCount: number;
    servicesCount: number;
    viewsCount: number;
    githubRepos: number;
    githubStars: number;
  };
  
  // Contact Info
  location: string;
  availability: boolean;
  hourlyRate?: number;
  contactEmail: string;
  
  // Meta
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileData {
  fullName: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  bio: string;
  location: string;
  availability: boolean;
  hourlyRate?: number;
  contactEmail: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  title?: string;
  description?: string;
  bio?: string;
  location?: string;
  availability?: boolean;
  hourlyRate?: number;
  contactEmail?: string;
}

const PROFILE_COLLECTION = 'profiles';

export const generateProfileId = (): string => {
  return 'profile_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const profileService = {
  // Create or Initialize Profile
  async createOrGetProfile(): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Check if profile exists
      const existingProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
      
      if (existingProfile) {
        return { success: true, profile: existingProfile };
      }
      
      // Create new empty profile
      const newProfile: Profile = {
        id: generateProfileId(),
        fullName: '',
        email: '',
        phone: '',
        title: '',
        description: '',
        bio: '',
        profileImage: '',
        profileImagePublicId: '',
        coverImage: '',
        coverImagePublicId: '',
        cvUrl: '',
        cvPublicId: '',
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: '',
          website: '',
          youtube: '',
          dribbble: '',
          behance: '',
          medium: '',
          stackoverflow: ''
        },
        experience: {
          years: 0,
          title: '',
          description: '',
          projectsCompleted: 0,
          clientsCount: 0,
          companies: []
        },
        technologies: [],
        skills: [],
        education: [],
        certifications: [],
        stats: {
          postsCount: 0,
          projectsCount: 0,
          servicesCount: 0,
          viewsCount: 0,
          githubRepos: 0,
          githubStars: 0
        },
        location: '',
        availability: true,
        contactEmail: '',
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).insertOne(newProfile);
      newProfile._id = result.insertedId;
      
      return { success: true, profile: newProfile };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { success: false, error: 'Failed to create profile' };
    }
  },

  // Get Profile
  async getProfile(): Promise<Profile | null> {
    try {
      const { db } = await connectToDatabase();
      const profile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  // Update Basic Profile Info
  async updateProfile(updates: UpdateProfileData): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { $set: updateData },
        { 
          returnDocument: 'after',
          upsert: true
        }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  },

  // Upload Profile Image
  async uploadProfileImage(imageBuffer: Buffer, fileName: string): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Get current profile to delete old image
      const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
      if (currentProfile?.profileImagePublicId) {
        try {
          await cloudinaryService.deleteImage(currentProfile.profileImagePublicId);
        } catch (error) {
          console.error('Error deleting old profile image:', error);
        }
      }
      
      // Upload new image to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(imageBuffer, 'portfolio/profile');
      
      // Update profile with new image
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            profileImage: uploadResult.secure_url,
            profileImagePublicId: uploadResult.public_id,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return { success: false, error: 'Failed to upload profile image' };
    }
  },

  // Upload Cover Image
  async uploadCoverImage(imageBuffer: Buffer, fileName: string): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Get current profile to delete old image
      const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
      if (currentProfile?.coverImagePublicId) {
        try {
          await cloudinaryService.deleteImage(currentProfile.coverImagePublicId);
        } catch (error) {
          console.error('Error deleting old cover image:', error);
        }
      }
      
      // Upload new image to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(imageBuffer, 'portfolio/cover');
      
      // Update profile with new image
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            coverImage: uploadResult.secure_url,
            coverImagePublicId: uploadResult.public_id,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error uploading cover image:', error);
      return { success: false, error: 'Failed to upload cover image' };
    }
  },


// Upload CV/Resume - FIXED VERSION WITH INLINE PREVIEW
async uploadCV(fileBuffer: Buffer, fileName: string): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    // Get current profile to delete old CV
    const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
    if (currentProfile?.cvPublicId) {
      try {
        // Use deleteDocument for raw files
        await cloudinaryService.deleteDocument(currentProfile.cvPublicId);
      } catch (error) {
        console.error('Error deleting old CV:', error);
      }
    }
    
    // Upload CV to Cloudinary using uploadDocument with inline flag
    const uploadResult = await cloudinaryService.uploadDocument(fileBuffer, 'portfolio/cv');
    
    // Transform URL to support inline viewing (fl_attachment changes to no flags)
    // The secure_url from Cloudinary should work for inline viewing by default
    let viewableUrl = uploadResult.secure_url;
    
    // Update profile with new CV
    const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
      {},
      { 
        $set: { 
          cvUrl: viewableUrl,
          cvPublicId: uploadResult.public_id,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return { success: false, error: 'Profile not found' };
    }
    
    return { success: true, profile: result };
  } catch (error) {
    console.error('Error uploading CV:', error);
    return { success: false, error: 'Failed to upload CV' };
  }
},

// Delete CV - FIXED VERSION
async deleteCV(): Promise<{ success: boolean; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
    
    if (!currentProfile) {
      return { success: false, error: 'Profile not found' };
    }
    
    if (currentProfile.cvPublicId) {
      // Use deleteDocument for raw files
      await cloudinaryService.deleteDocument(currentProfile.cvPublicId);
    }
    
    const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
      {},
      { 
        $set: { 
          cvUrl: '',
          cvPublicId: '',
          updatedAt: new Date()
        } 
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting CV:', error);
    return { success: false, error: 'Failed to delete CV' };
  }
},

// Update Social Links - FIXED VERSION
async updateSocialLinks(socialLinks: Partial<Profile['socialLinks']>): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    // Get current profile to merge with existing social links
    const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
    
    if (!currentProfile) {
      return { success: false, error: 'Profile not found' };
    }
    
    // Merge existing social links with new updates
    const updatedSocialLinks = {
      ...currentProfile.socialLinks,
      ...socialLinks
    };
    
    const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
      {},
      { 
        $set: { 
          socialLinks: updatedSocialLinks,
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return { success: false, error: 'Profile not found' };
    }
    
    return { success: true, profile: result };
  } catch (error) {
    console.error('Error updating social links:', error);
    return { success: false, error: 'Failed to update social links' };
  }
},

  // Update Skills
  async updateSkills(skills: Profile['skills']): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            skills: skills,
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error updating skills:', error);
      return { success: false, error: 'Failed to update skills' };
    }
  },

  // Update Technologies
  async updateTechnologies(technologies: string[]): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            technologies: technologies,
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error updating technologies:', error);
      return { success: false, error: 'Failed to update technologies' };
    }
  },

// Update Experience 
async updateExperience(experience: Partial<Profile['experience']>): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    // Get current profile to merge with existing experience
    const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
    
    if (!currentProfile) {
      return { success: false, error: 'Profile not found' };
    }
    
    // Merge existing experience with new updates
    const updatedExperience = {
      ...currentProfile.experience,
      ...experience
    };
    
    const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
      {},
      { 
        $set: { 
          experience: updatedExperience,
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return { success: false, error: 'Profile not found' };
    }
    
    return { success: true, profile: result };
  } catch (error) {
    console.error('Error updating experience:', error);
    return { success: false, error: 'Failed to update experience' };
  }
},
  // Update Education
  async updateEducation(education: Profile['education']): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            education: education,
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error updating education:', error);
      return { success: false, error: 'Failed to update education' };
    }
  },

  // Update Certifications
  async updateCertifications(certifications: Profile['certifications']): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            certifications: certifications,
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error updating certifications:', error);
      return { success: false, error: 'Failed to update certifications' };
    }
  },

  // Toggle Profile Publish Status
  async togglePublishStatus(isPublished: boolean): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            isPublished: isPublished,
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, profile: result };
    } catch (error) {
      console.error('Error updating profile status:', error);
      return { success: false, error: 'Failed to update profile status' };
    }
  },

  // Delete Profile Image
  async deleteProfileImage(): Promise<{ success: boolean; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
      
      if (!currentProfile) {
        return { success: false, error: 'Profile not found' };
      }
      
      if (currentProfile.profileImagePublicId) {
        await cloudinaryService.deleteImage(currentProfile.profileImagePublicId);
      }
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            profileImage: '',
            profileImagePublicId: '',
            updatedAt: new Date()
          } 
        }
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting profile image:', error);
      return { success: false, error: 'Failed to delete profile image' };
    }
  },

  // Delete Cover Image
  async deleteCoverImage(): Promise<{ success: boolean; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const currentProfile = await db.collection<Profile>(PROFILE_COLLECTION).findOne({});
      
      if (!currentProfile) {
        return { success: false, error: 'Profile not found' };
      }
      
      if (currentProfile.coverImagePublicId) {
        await cloudinaryService.deleteImage(currentProfile.coverImagePublicId);
      }
      
      const result = await db.collection<Profile>(PROFILE_COLLECTION).findOneAndUpdate(
        {},
        { 
          $set: { 
            coverImage: '',
            coverImagePublicId: '',
            updatedAt: new Date()
          } 
        }
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting cover image:', error);
      return { success: false, error: 'Failed to delete cover image' };
    }
  },

 
};