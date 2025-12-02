import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/mongodb/postService';

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