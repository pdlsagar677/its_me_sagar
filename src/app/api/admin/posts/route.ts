import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/adminAuth";


const getMockPosts = () => {
  return [
    {
      id: '1',
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      content: 'Lorem ipsum dolor sit amet...',
      excerpt: 'Learn how to build modern web applications with Next.js 14',
      category: 'Web Development',
      tags: ['Next.js', 'React', 'TypeScript'],
      isPublished: true,
      isFeatured: true,
      authorId: 'admin',
      authorName: 'Admin',
      views: 1250,
      likes: 89,
      comments: 12,
      readingTime: 5,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Mastering Tailwind CSS',
      slug: 'mastering-tailwind-css',
      content: 'Lorem ipsum dolor sit amet...',
      excerpt: 'A comprehensive guide to Tailwind CSS utilities',
      category: 'CSS',
      tags: ['Tailwind', 'CSS', 'Design'],
      isPublished: true,
      isFeatured: false,
      authorId: 'admin',
      authorName: 'Admin',
      views: 890,
      likes: 45,
      comments: 8,
      readingTime: 8,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
  ];
};

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let posts = getMockPosts();
    
    if (status === 'published') {
      posts = posts.filter(post => post.isPublished);
    } else if (status === 'draft') {
      posts = posts.filter(post => !post.isPublished);
    } else if (status === 'featured') {
      posts = posts.filter(post => post.isFeatured);
    }

    return NextResponse.json({ posts }, { status: 200 });
    
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postData = await request.json();
    
    const newPost = {
      ...postData,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: admin.id,
      authorName: admin.username,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, save to database:
    // const { db } = await connectToDatabase();
    // const result = await db.collection(POSTS_COLLECTION).insertOne(newPost);
    // newPost._id = result.insertedId;

    return NextResponse.json({ post: newPost }, { status: 201 });
    
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}