import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/mongodb/postService';

// GET - Get single post by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    console.log('🔍 API: Fetching post with ID:', id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await postService.getPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Only return if published
    if (!post.isPublished) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Increment views
    try {
      await postService.updatePost(post.id, {
        views: (post.views || 0) + 1
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
    
    // Get related posts (by category)
    const allPosts = await postService.getAllPosts();
    const publishedPosts = allPosts.filter(p => p.isPublished && p.id !== post.id);
    
    const relatedPosts = publishedPosts
      .filter(p => p.category === post.category)
      .slice(0, 3);

    return NextResponse.json({
      post,
      relatedPosts
    });
  } catch (error) {
    console.error('GET post by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Get form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string || 'General';
    const tags = (formData.get('tags') as string)?.split(',') || [];
    const isPublished = formData.get('isPublished') === 'true';
    const isFeatured = formData.get('isFeatured') === 'true';
    const image = formData.get('image') as File | null;
    
    // Find existing post
    const existingPost = await postService.getPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: any = {
      title,
      description,
      content,
      category,
      tags,
      isPublished,
      isFeatured,
      updatedAt: new Date()
    };
    
    // Handle image upload if new image provided
    let imageUrl = existingPost.coverImage;
    if (image) {
      // Here you would upload the image to your storage (Cloudinary, S3, etc.)
      // For now, we'll keep the existing image URL
      // imageUrl = await uploadImage(image);
    }
    
    if (imageUrl) {
      updateData.coverImage = imageUrl;
    }
    
    // Calculate reading time
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200) || 1;
    updateData.readingTime = readingTime;
    
    // Update post
    const result = await postService.updatePost(id, updateData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post: result.post
    });
    
  } catch (error) {
    console.error('PUT post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const result = await postService.deletePost(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete post' },
        { status: 500 }
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