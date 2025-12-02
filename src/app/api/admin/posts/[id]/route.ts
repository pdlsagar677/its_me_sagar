import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/mongodb/postService';

// Helper to parse FormData
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const entries: Record<string, any> = {};
  
  for (const [key, value] of formData.entries()) {
    if (key === 'tags' && typeof value === 'string') {
      entries[key] = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (key === 'isPublished' || key === 'isFeatured') {
      entries[key] = value === 'true';
    } else if (key === 'readingTime') {
      entries[key] = parseInt(value as string) || 5;
    } else if (key === 'image') {
      entries[key] = value;
    } else {
      entries[key] = value;
    }
  }
  
  return entries;
}

// GET post by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const post = await postService.getPostById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('GET post error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// UPDATE post
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const formData = await parseFormData(request);
    
    // Handle image upload if new image is provided
    let coverImageUrl: string | undefined;
    if (formData.image && formData.image instanceof File) {
      // Convert to base64 (temporary if no Cloudinary)
      const buffer = Buffer.from(await formData.image.arrayBuffer());
      coverImageUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      formData.coverImage = coverImageUrl;
    }
    
    // Remove image file from updates object
    delete formData.image;

    const result = await postService.updatePost(id, formData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ post: result.post });
  } catch (error) {
    console.error('PUT post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE post - FIXED
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const result = await postService.deletePost(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('DELETE post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}