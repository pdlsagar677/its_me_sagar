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

// GET: Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const result = await projectService.getProjectById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      project: result.project
    });
  } catch (error) {
    console.error('GET project error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT: Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = await request.json();
    
    const result = await projectService.updateProject(id, {
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription,
      technologies: data.technologies,
      githubUrl: data.githubUrl,
      projectUrl: data.projectUrl,
      isFeatured: data.isFeatured,
      status: data.status,
      complexity: data.complexity,
      featuredTechnologies: data.featuredTechnologies,
      projectDate: data.projectDate ? new Date(data.projectDate) : undefined
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
      message: 'Project updated successfully' 
    });
  } catch (error) {
    console.error('PUT project error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE: Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');
    
    if (action === 'delete-cover-image') {
      const result = await projectService.deleteCoverImage(id);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Cover image deleted successfully' 
      });
    }
    
    if (action === 'delete-screenshot') {
      const screenshotUrl = searchParams.get('url');
      if (!screenshotUrl) {
        return NextResponse.json(
          { error: 'Screenshot URL required' },
          { status: 400 }
        );
      }
      
      const result = await projectService.deleteScreenshot(id, screenshotUrl);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Screenshot deleted successfully' 
      });
    }
    
    // Default: delete entire project
    const result = await projectService.deleteProject(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('DELETE project error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}