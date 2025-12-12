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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    console.log('=== API REQUEST START ===');
    console.log('Action:', action);
    console.log('Full URL:', request.url);
    console.log('Search Params:', Object.fromEntries(searchParams.entries()));
    
    // EXPLICIT: Handle CV requests ONLY when action=cv
    if (action === 'cv') {
      console.log('Handling CV request');
      return handleCVRequest(request);
    }
    
    // DEFAULT: Always return JSON profile for all other cases
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
        { error: 'CV not found' },
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
    const response = await fetch(profile.cvUrl);
    
    if (!response.ok) {
      console.error('Failed to fetch CV from Cloudinary:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch CV from storage' },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Get the PDF buffer
    const pdfBuffer = await response.arrayBuffer();

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
      { error: 'Failed to load CV' },
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
    
    // Remove MongoDB _id and convert dates to strings
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
    console.log('Profile data size:', JSON.stringify(profileData).length, 'characters');
    
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