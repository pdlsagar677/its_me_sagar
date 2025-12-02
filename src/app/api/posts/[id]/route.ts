import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/mongodb/postService';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    console.log('🔍 API: Fetching post with ID:', id);
    
    if (!id) {
      console.log('❌ API: No ID provided');
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await postService.getPostById(id);
    
    if (!post) {
      console.log('❌ API: Post not found in database for ID:', id);
      
      // Let's check what posts are actually in the database
      const allPosts = await postService.getAllPosts();
      console.log('📊 API: Total posts in DB:', allPosts.length);
      console.log('📊 API: Available post IDs:', allPosts.map(p => p.id));
      
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ API: Post found:', {
      id: post.id,
      title: post.title,
      isPublished: post.isPublished,
      category: post.category
    });

    console.log('✅ API: Returning post data');
    
    // Increment views
    try {
      await postService.updatePost(post.id, {
        views: (post.views || 0) + 1
      });
    } catch (error) {
      console.error('⚠️ API: Error incrementing views:', error);
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
    console.error('❌ API: GET post by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}