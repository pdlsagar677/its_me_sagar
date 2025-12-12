import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    console.log('API Request - action:', action, 'URL:', request.url);
    
    // Handle CV viewing/downloading
    if (action === 'cv') {
      return handleCVRequest(request);
    }
    
    // IMPORTANT: Default case - MUST return JSON profile
    return await handleProfileRequest();
    
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle CV request - returns PDF
async function handleCVRequest(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download') === 'true';
    
    const { db } = await connectToDatabase();
    const PROFILE_COLLECTION = 'profiles';
    
    // Get published profile with CV
    const profile = await db.collection(PROFILE_COLLECTION).findOne({ 
      isPublished: true 
    });
    
    if (!profile || !profile.cvUrl) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      );
    }

    // Fetch the PDF from Cloudinary
    const response = await fetch(profile.cvUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch CV' },
        { status: 500 }
      );
    }

    // Get the PDF buffer
    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': download 
          ? 'attachment; filename="CV_Resume.pdf"' 
          : 'inline; filename="CV_Resume.pdf"',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('CV proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to load CV' },
      { status: 500 }
    );
  }
}

// Handle profile request - returns JSON
async function handleProfileRequest() {
  try {
    const { db } = await connectToDatabase();
    const PROFILE_COLLECTION = 'profiles';
    
    // Get only published profile
    const profile = await db.collection(PROFILE_COLLECTION).findOne({ 
      isPublished: true 
    });
    
    if (!profile) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Profile not found or not published',
          profile: null 
        },
        { status: 404 }
      );
    }
    
    // Remove MongoDB _id and convert to string
    const profileData = {
      ...profile,
      _id: profile._id ? profile._id.toString() : null,
      createdAt: profile.createdAt ? profile.createdAt.toISOString() : null,
      updatedAt: profile.updatedAt ? profile.updatedAt.toISOString() : null
    };
    
    console.log('Returning profile data for:', profileData.fullName);
    
    return NextResponse.json({ 
      success: true,
      profile: profileData
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch profile',
        profile: null 
      },
      { status: 500 }
    );
  }
}