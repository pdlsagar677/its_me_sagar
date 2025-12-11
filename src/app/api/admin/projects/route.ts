import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/mongodb/projectService';

// Helper function to check authentication
async function checkAuth(request: NextRequest) {
  const cookies = request.headers.get('cookie') || '';
  const hasSession = cookies.includes('session-token') || cookies.includes('auth');
  
  if (!hasSession) {
    return { authorized: false, error: 'Unauthorized' };
  }
  
  return { authorized: true };
}

// GET: Get all projects or by status
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const featured = searchParams.get('featured');
    
    // Type-safe status validation
    const status = statusParam && ['completed', 'in-progress', 'planned'].includes(statusParam)
      ? (statusParam as 'completed' | 'in-progress' | 'planned')
      : undefined;
    
    let result;
    
    if (featured === 'true') {
      result = await projectService.getFeaturedProjects();
    } else {
      result = await projectService.getAllProjects(status);
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      projects: result.projects || []
    });
  } catch (error) {
    console.error('GET projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST: Create new project or upload images
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file uploads
      const formData = await request.formData();
      const action = formData.get('action') as string;
      const projectId = formData.get('projectId') as string;
      
      if (!action) {
        return NextResponse.json(
          { error: 'Action parameter required' },
          { status: 400 }
        );
      }
      
      let result;
      
      switch (action) {
        case 'upload-cover-image': {
          const image = formData.get('image') as File;
          if (!image || !projectId) {
            return NextResponse.json(
              { error: 'Image file and projectId required' },
              { status: 400 }
            );
          }
          
          const buffer = Buffer.from(await image.arrayBuffer());
          result = await projectService.uploadCoverImage(projectId, buffer, image.name);
          break;
        }
        
        case 'upload-screenshot': {
          const image = formData.get('image') as File;
          if (!image || !projectId) {
            return NextResponse.json(
              { error: 'Image file and projectId required' },
              { status: 400 }
            );
          }
          
          const buffer = Buffer.from(await image.arrayBuffer());
          result = await projectService.uploadScreenshot(projectId, buffer, image.name);
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
        project: result.project,
        message: `${action.replace('upload-', '').replace('-image', ' image').toUpperCase()} uploaded successfully` 
      });
      
    } else if (contentType.includes('application/json')) {
      // Handle project creation
      const data = await request.json();
      
      const requiredFields = ['title', 'description', 'shortDescription', 'technologies', 'status'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return NextResponse.json(
            { error: `${field} is required` },
            { status: 400 }
          );
        }
      }
      
      const result = await projectService.createProject({
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        githubUrl: data.githubUrl,
        projectUrl: data.projectUrl,
        coverImage: data.coverImage,
        isFeatured: data.isFeatured || false,
        status: data.status,
        complexity: data.complexity || 'intermediate',
        featuredTechnologies: data.featuredTechnologies || [],
        projectDate: data.projectDate ? new Date(data.projectDate) : new Date()
      });
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true,
        project: result.project,
        message: 'Project created successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('POST projects error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}