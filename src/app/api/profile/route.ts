import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Handle CV viewing/downloading
    if (action === 'cv') {
      return handleCVRequest(request);
    }
    
    // Default: Get profile data
    const { db } = await connectToDatabase();
    const PROFILE_COLLECTION = 'profiles';
    
    // Get only published profile
    const profile = await db.collection(PROFILE_COLLECTION).findOne({ 
      isPublished: true 
    });
    
    if (!profile) {
      return NextResponse.json(
        { 
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
    
    return NextResponse.json({ 
      success: true,
      profile: profileData
    });
  } catch (error) {
    console.error('Public profile fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch profile',
        profile: null 
      },
      { status: 500 }
    );
  }
}

// Handle CV viewing/downloading
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
    // Use 'inline' for viewing in browser, 'attachment' for downloading
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