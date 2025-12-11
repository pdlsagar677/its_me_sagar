import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { ObjectId } from 'mongodb';

// GET: Get single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find project by ID
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(id)
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Transform the data for response
    const projectData = {
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
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      // Additional fields you might have
      client: project.client || '',
      role: project.role || '',
      duration: project.duration || '',
      tags: project.tags || [],
    };

    return NextResponse.json({ 
      success: true,
      project: projectData
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
    
  } catch (error) {
    console.error('GET project by ID error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}