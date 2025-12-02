import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  User,
  Clock,
  Tag,
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  Share2,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName: string;
  views: number;
  likes: number;
  comments: number;
  readingTime: number;
  createdAt: string;
  isPublished?: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/posts/${id}`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      notFound();
    }
    
    const data = await response.json();
    const post: BlogPost = data.post;
    const relatedPosts: BlogPost[] = data.relatedPosts || [];

    if (!post || !post.isPublished) {
      notFound();
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const shareUrl = `${baseUrl}/blog/${id}`;
    const shareText = `Check out this article: ${post.title}`;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Navigation */}
        <nav className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              href="/blog"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category */}
          <div className="mb-6">
            <Link 
              href={`/blog?category=${post.category}`}
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/20 rounded-lg text-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {post.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-300 mb-8">
            {post.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-400">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">{post.authorName}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              <span>{post.views?.toLocaleString() || 0} views</span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-gray-700/50">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

         

          {/* Content */}
          <div className="mb-12">
            <div 
              className="text-gray-300 leading-relaxed whitespace-pre-line"
              style={{ lineHeight: '1.8' }}
            >
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mb-12 p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold">{post.authorName}</h4>
                <p className="text-gray-400">Author</p>
              </div>
            </div>
            <p className="text-gray-300">
              Sharing knowledge and insights about web development, technology, and design.
            </p>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Related Articles</h2>
              <Link 
                href="/blog"
                className="text-orange-400 hover:text-orange-300 flex items-center text-sm font-medium"
              >
                View all articles
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article 
                  key={relatedPost.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-orange-500/30 transition-all"
                >
                  {relatedPost.coverImage && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded">
                        {relatedPost.category}
                      </span>
                      <span className="text-sm text-gray-400">
                        {relatedPost.readingTime} min
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 hover:text-orange-300 transition-colors line-clamp-2">
                      <Link href={`/blog/${relatedPost.id}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {relatedPost.excerpt || relatedPost.description}
                    </p>
                    <Link 
                      href={`/blog/${relatedPost.id}`}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center"
                    >
                      Read more
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}

// Generate static params
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/posts`;
    
    const response = await fetch(apiUrl, { 
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.posts || !Array.isArray(data.posts)) {
      return [];
    }
    
    // Only include published posts
    const publishedPosts = data.posts.filter((post: BlogPost) => post.isPublished);
    
    return publishedPosts.map((post: BlogPost) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/posts/${id}`);
    
    if (!response.ok) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }
    
    const data = await response.json();
    const post = data.post;
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }
    
    return {
      title: `${post.title} | Blog`,
      description: post.description || post.excerpt,
    };
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post',
    };
  }
}