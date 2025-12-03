import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/mongodb/postService';

// GET - Get all posts with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    // Get all posts first (you'll need to filter published posts)
    const allPosts = await postService.getAllPosts();
    
    // Filter only published posts
    const publishedPosts = allPosts.filter(post => post.isPublished === true);
    
    // Apply filters if provided
    let filteredPosts = publishedPosts;
    
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by latest first
    filteredPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Get featured posts (first 3 published posts)
    const featuredPosts = publishedPosts
      .filter(post => post.isFeatured)
      .slice(0, 3);
    
    // Get categories
    const categories = [...new Set(publishedPosts.map(post => post.category))];
    
    // Get all tags
    const allTags = publishedPosts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)];

    return NextResponse.json({
      posts: paginatedPosts,
      featuredPosts,
      totalPosts: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
      currentPage: page,
      categories,
      tags: uniqueTags.slice(0, 20), // Limit to 20 most common tags
    });
  } catch (error) {
    console.error('GET posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string || description.substring(0, 150) + '...';
    const category = formData.get('category') as string || 'General';
    const tags = (formData.get('tags') as string)?.split(',') || [];
    const isPublished = formData.get('isPublished') === 'true';
    const isFeatured = formData.get('isFeatured') === 'true';
    const authorId = formData.get('authorId') as string || 'admin';
    const authorName = formData.get('authorName') as string || 'Admin';
    const image = formData.get('image') as File | null;
    
    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Title, description, and content are required' },
        { status: 400 }
      );
    }
    
    // Handle image upload if provided
    let imageUrl = '';
    if (image) {
      // Here you would upload the image to your storage (Cloudinary, S3, etc.)
      // For now, we'll use a placeholder
      // imageUrl = await uploadImage(image);
    }
    
    // Create post data
    const postData = {
      title,
      description,
      content,
      excerpt,
      coverImage: imageUrl,
      category,
      tags,
      isPublished,
      isFeatured,
      authorId,
      authorName,
    };
    
    const result = await postService.createPost(postData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post: result.post
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST create error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}