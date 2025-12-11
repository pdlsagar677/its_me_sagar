// app/api/projects/route.ts (modified)
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';

// Helper function to check if request is from admin
async function isAdminRequest(request: NextRequest) {
  const cookies = request.headers.get('cookie') || '';
  return cookies.includes('session-token') || cookies.includes('auth');
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    
    const isAdmin = await isAdminRequest(request);
    
    // Build query based on filters
    const query: any = {};
    
    // Only show published/completed projects for public
    if (!isAdmin) {
      query.status = 'completed'; // Or any logic for public viewing
    }
    
    const status = searchParams.get('status');
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Get projects from database
    const projects = await db.collection('projects')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Transform for response
    const responseProjects = projects.map((project: any) => ({
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      shortDescription: project.shortDescription,
      technologies: project.technologies || [],
      githubUrl: project.githubUrl,
      projectUrl: project.projectUrl,
      coverImage: project.coverImage,
      screenshots: project.screenshots || [],
      isFeatured: project.isFeatured || false,
      status: project.status || 'completed',
      complexity: project.complexity || 'intermediate',
      featuredTechnologies: project.featuredTechnologies || [],
      projectDate: project.projectDate || project.createdAt,
    }));
    
    return NextResponse.json({ 
      success: true,
      projects: responseProjects
    });
    
  } catch (error) {
    console.error('GET projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}