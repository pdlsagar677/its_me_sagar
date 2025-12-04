import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/lib/mongodb/profileService';

// Helper function to check authentication
async function checkAuth(request: NextRequest) {
  // Get session token from cookies
  const cookies = request.headers.get('cookie') || '';
  
  // Simple check - replace with your actual auth logic
  const hasSession = cookies.includes('session-token') || cookies.includes('auth');
  
  if (!hasSession) {
    return { authorized: false, error: 'Unauthorized' };
  }
  
  return { authorized: true };
}

// GET profile
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await profileService.getProfile();
    
    if (!profile) {
      // Create empty profile if doesn't exist
      const result = await profileService.createOrGetProfile();
      if (!result.success || !result.profile) {
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }
      return NextResponse.json({ profile: result.profile });
    }
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST: Handle file uploads
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const action = formData.get('action') as string || 
                   request.headers.get('x-action') as string ||
                   request.nextUrl.searchParams.get('action');

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter required' },
        { status: 400 }
      );
    }

    let result;
    
    switch (action) {
      case 'upload-profile-image': {
        const image = formData.get('image') as File;
        if (!image) {
          return NextResponse.json(
            { error: 'Image file required' },
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
            { error: 'Image file required' },
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
            { error: 'CV file required' },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await cvFile.arrayBuffer());
        result = await profileService.uploadCV(buffer, cvFile.name);
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
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
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// PUT: Update profile information
export async function PUT(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await request.json();
      const { action, ...updates } = data;
      
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
              { error: 'Social links data required' },
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
              { error: 'Skills data required' },
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
              { error: 'Technologies data required' },
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
              { error: 'Experience data required' },
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
              { error: 'Education data required' },
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
              { error: 'Certifications data required' },
              { status: 400 }
            );
          }
          result = await profileService.updateCertifications(certifications);
          break;
        }
        
        default: {
          // Default to basic profile update
          result = await profileService.updateProfile(updates);
          break;
        }
      }
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true,
        profile: result.profile,
        message: 'Profile updated successfully' 
      });
      
    } else if (contentType.includes('multipart/form-data')) {
      // Handle form data uploads
      const formData = await request.formData();
      const action = formData.get('action') as string;
      
      // This should be handled by POST, but for completeness
      return NextResponse.json(
        { error: 'Use POST for file uploads' },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// DELETE: Handle deletion of profile images or CV
export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter required' },
        { status: 400 }
      );
    }

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
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
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
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}