import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';

export async function GET() {
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