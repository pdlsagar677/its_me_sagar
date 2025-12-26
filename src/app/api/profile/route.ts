import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';

interface MongoDBProfile {
  _id?: any;
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  description?: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  cvUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
    youtube?: string;
    dribbble?: string;
    behance?: string;
    medium?: string;
    stackoverflow?: string;
  };
  experience?: {
    years?: number;
    title?: string;
    description?: string;
    projectsCompleted?: number;
    clientsCount?: number;
    companies?: {
      name?: string;
      position?: string;
      duration?: string;
      description?: string;
    }[];
  };
  technologies?: string[];
  skills?: {
    category?: string;
    items?: string[];
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
  education?: {
    degree?: string;
    institution?: string;
    year?: string;
    description?: string;
  }[];
  certifications?: {
    name?: string;
    issuer?: string;
    year?: string;
    url?: string;
  }[];
  stats?: {
    postsCount?: number;
    projectsCount?: number;
    servicesCount?: number;
    viewsCount?: number;
    githubRepos?: number;
    githubStars?: number;
  };
  availability?: boolean;
  hourlyRate?: number;
  contactEmail?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// GET: Handle both profile JSON and CV PDF requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    console.log('=== PROFILE API REQUEST ===');
    console.log('Action:', action || 'get-profile');
    console.log('URL:', request.url);
    
    // If action is explicitly 'cv', handle CV request
    if (action === 'cv') {
      console.log('Handling CV request');
      return await handleCVRequest(request);
    }
    
    // Otherwise, handle regular profile JSON request
    console.log('Handling profile JSON request');
    return await handleProfileRequest();
    
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// Handle CV request - returns PDF
async function handleCVRequest(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download') === 'true';
    
    const { db } = await connectToDatabase();
    const PROFILE_COLLECTION = 'profiles';
    
    // Get published profile with CV
    const profile = await db.collection(PROFILE_COLLECTION).findOne({ 
      isPublished: true 
    }) as MongoDBProfile | null;
    
    if (!profile || !profile.cvUrl) {
      return NextResponse.json(
        { 
          success: false,
          error: 'CV not found or profile not published'
        },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    console.log('Fetching CV from:', profile.cvUrl);

    // Fetch the PDF from Cloudinary
    const cvResponse = await fetch(profile.cvUrl);
    
    if (!cvResponse.ok) {
      console.error('Failed to fetch CV from Cloudinary:', cvResponse.status);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch CV from storage' 
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Get the PDF buffer
    const pdfBuffer = await cvResponse.arrayBuffer();

    console.log('Returning PDF, size:', pdfBuffer.byteLength, 'bytes');

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': download 
          ? 'attachment; filename="CV_Resume.pdf"' 
          : 'inline; filename="CV_Resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('CV proxy error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load CV',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// Handle profile request - returns JSON
async function handleProfileRequest(): Promise<NextResponse> {
  try {
    const { db } = await connectToDatabase();
    const PROFILE_COLLECTION = 'profiles';
    
    console.log('Fetching profile from database...');
    
    // Get only published profile
    const profile = await db.collection(PROFILE_COLLECTION).findOne({ 
      isPublished: true 
    }) as MongoDBProfile | null;
    
    if (!profile) {
      console.log('No published profile found');
      return NextResponse.json(
        { 
          success: false,
          error: 'Profile not found or not published',
          profile: null 
        },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
    // Transform MongoDB document to client-friendly format
    const profileData = {
      id: profile._id ? profile._id.toString() : 'unknown',
      fullName: profile.fullName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      title: profile.title || '',
      description: profile.description || '',
      bio: profile.bio || '',
      profileImage: profile.profileImage || '',
      coverImage: profile.coverImage || '',
      cvUrl: profile.cvUrl || '',
      socialLinks: profile.socialLinks || {
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
      experience: profile.experience || {
        years: 0,
        title: '',
        description: '',
        projectsCompleted: 0,
        clientsCount: 0,
        companies: []
      },
      technologies: profile.technologies || [],
      skills: profile.skills || [],
      education: profile.education || [],
      certifications: profile.certifications || [],
      stats: profile.stats || {
        postsCount: 0,
        projectsCount: 0,
        servicesCount: 0,
        viewsCount: 0,
        githubRepos: 0,
        githubStars: 0
      },
      location: profile.location || '',
      availability: profile.availability ?? true,
      hourlyRate: profile.hourlyRate,
      contactEmail: profile.contactEmail || profile.email || '',
      isPublished: profile.isPublished ?? false,
      createdAt: profile.createdAt ? profile.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: profile.updatedAt ? profile.updatedAt.toISOString() : new Date().toISOString()
    };
    
    console.log('Returning profile JSON for:', profileData.fullName);
    
    return NextResponse.json(
      { 
        success: true,
        profile: profileData
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch profile',
        message: error instanceof Error ? error.message : 'Unknown error',
        profile: null 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// POST: Handle file uploads and admin operations
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized' 
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const action = formData.get('action') as string;
    
    if (!action) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Action parameter required' 
        },
        { status: 400 }
      );
    }

    // Import profile service for admin operations
    const { profileService } = await import('@/lib/mongodb/profileService');
    let result;
    
    switch (action) {
      case 'upload-profile-image': {
        const image = formData.get('image') as File;
        if (!image) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Image file required' 
            },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        result = await profileService.uploadProfileImage(buffer, image.name);
        break;
      }

      case 'upload-cover-image': {
        const image = formData.get('image') as File;
        if (!image) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Image file required' 
            },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        result = await profileService.uploadCoverImage(buffer, image.name);
        break;
      }

      case 'upload-cv': {
        const cvFile = formData.get('cv') as File;
        if (!cvFile) {
          return NextResponse.json(
            { 
              success: false,
              error: 'CV file required' 
            },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await cvFile.arrayBuffer());
        result = await profileService.uploadCV(buffer, cvFile.name);
        break;
      }

      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid action' 
          },
          { status: 400 }
        );
    }
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      profile: result.profile,
      message: `${action.replace('upload-', '').replace('-image', ' image').toUpperCase()} uploaded successfully` 
    });
  } catch (error) {
    console.error('POST profile error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT: Update profile information
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized' 
        },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await request.json();
      const { action, ...updates } = data;
      
      if (!action) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Action parameter required' 
          },
          { status: 400 }
        );
      }

      // Import profile service
      const { profileService } = await import('@/lib/mongodb/profileService');
      let result;
      
      switch (action) {
        case 'toggle-publish': {
          const isPublished = updates.isPublished === true || updates.isPublished === 'true';
          result = await profileService.togglePublishStatus(isPublished);
          break;
        }
        
        case 'update-basic': {
          result = await profileService.updateProfile(updates);
          break;
        }
        
        case 'update-social': {
          const socialLinks = updates.socialLinks;
          if (!socialLinks) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Social links data required' 
              },
              { status: 400 }
            );
          }
          result = await profileService.updateSocialLinks(socialLinks);
          break;
        }
        
        case 'update-skills': {
          const skills = updates.skills;
          if (!skills) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Skills data required' 
              },
              { status: 400 }
            );
          }
          result = await profileService.updateSkills(skills);
          break;
        }
        
        case 'update-technologies': {
          const technologies = updates.technologies;
          if (!technologies) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Technologies data required' 
              },
              { status: 400 }
            );
          }
          result = await profileService.updateTechnologies(technologies);
          break;
        }
        
        case 'update-experience': {
          const experience = updates.experience;
          if (!experience) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Experience data required' 
              },
              { status: 400 }
            );
          }
          result = await profileService.updateExperience(experience);
          break;
        }
        
        case 'update-education': {
          const education = updates.education;
          if (!education) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Education data required' 
              },
              { status: 400 }
            );
          }
          result = await profileService.updateEducation(education);
          break;
        }
        
        case 'update-certifications': {
          const certifications = updates.certifications;
          if (!certifications) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Certifications data required' 
              },
              { status: 400 }
            );
          }
          result = await profileService.updateCertifications(certifications);
          break;
        }
        
        default: {
          return NextResponse.json(
            { 
              success: false,
              error: 'Invalid action' 
            },
            { status: 400 }
          );
        }
      }
      
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false,
            error: result.error 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true,
        profile: result.profile,
        message: 'Profile updated successfully' 
      });
      
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unsupported content type. Use application/json' 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE: Handle deletion of profile images or CV
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized' 
        },
        { status: 401 }
      );
    }

    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Action parameter required' 
        },
        { status: 400 }
      );
    }

    // Import profile service
    const { profileService } = await import('@/lib/mongodb/profileService');
    let result;
    
    switch (action) {
      case 'delete-profile-image':
        result = await profileService.deleteProfileImage();
        break;
        
      case 'delete-cover-image':
        result = await profileService.deleteCoverImage();
        break;
        
      case 'delete-cv':
        result = await profileService.deleteCV();
        break;
        
      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid action' 
          },
          { status: 400 }
        );
    }
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error 
        },
        { status: 500 }
      );
    }
    
    // Fetch updated profile after deletion
    const updatedProfile = await profileService.getProfile();
    
    return NextResponse.json({ 
      success: true,
      profile: updatedProfile,
      message: `${action.replace('delete-', '').replace('-image', ' image').toUpperCase()} deleted successfully` 
    });
  } catch (error) {
    console.error('DELETE profile error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete item',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to check authentication (replace with your actual auth logic)
async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    // Get session token from cookies
    const cookies = request.headers.get('cookie') || '';
    
    // Check for session tokens (customize based on your auth system)
    const hasValidSession = 
      cookies.includes('session-token') || 
      cookies.includes('auth-token') ||
      cookies.includes('next-auth.session-token') ||
      cookies.includes('__Secure-next-auth.session-token');
    
    // For development, you might want to allow requests
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Auth bypassed');
      return true;
    }
    
    return hasValidSession;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}