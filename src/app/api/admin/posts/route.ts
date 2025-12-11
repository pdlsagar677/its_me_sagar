import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/mongodb/postService';
import { cloudinaryService } from '@/lib/cloudinary/cloudinary';

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
      entries[key] = value; // Keep as File
    } else {
      entries[key] = value;
    }
  }
  
  return entries;
}

// GET all posts or by status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'published' | 'draft' | 'featured' | null;

    let posts;
    
    if (status === 'featured') {
      // Get all posts and filter for featured ones
      const allPosts = await postService.getAllPosts();
      posts = allPosts.filter(post => post.isFeatured === true);
    } else if (status === 'published' || status === 'draft') {
      // Handle published/draft posts with correct type
      posts = await postService.getPostsByStatus(status);
    } else {
      // Get all posts if no status specified
      posts = await postService.getAllPosts();
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('GET posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// CREATE new post with image upload
export async function POST(request: NextRequest) {
  try {
    const formData = await parseFormData(request);
    
    // Validate required fields
    if (!formData.title || !formData.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const slug = formData.slug || formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    // Handle image upload to Cloudinary
    let coverImageUrl: string | undefined;
    if (formData.image && formData.image instanceof File) {
      const buffer = Buffer.from(await formData.image.arrayBuffer());
      const uploadResult = await cloudinaryService.uploadImage(buffer, 'blog-posts');
      coverImageUrl = uploadResult.url;
    }

    // Calculate reading time if not provided
    const readingTime = formData.readingTime || 
      Math.ceil((formData.content as string).split(/\s+/).length / 200) || 5;

    // Create post data
    const postData = {
      title: formData.title as string,
      content: formData.content as string,
      description: (formData.description as string) || 
                   (formData.excerpt as string) || 
                   (formData.content as string).substring(0, 200) + '...',
      excerpt: (formData.excerpt as string) || 
               (formData.content as string).substring(0, 150) + '...',
      coverImage: coverImageUrl,
      category: (formData.category as string) || 'General',
      tags: (formData.tags as string[]) || [],
      isPublished: Boolean(formData.isPublished),
      isFeatured: Boolean(formData.isFeatured),
      authorId: formData.authorId as string || 'admin',
      authorName: formData.authorName as string || 'Admin',
      readingTime,
      slug,
      seoTitle: formData.seoTitle as string,
      seoDescription: formData.seoDescription as string,
    };

    const result = await postService.createPost(postData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ post: result.post }, { status: 201 });
  } catch (error) {
    console.error('POST posts error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}