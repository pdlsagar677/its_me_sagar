"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Filter,
  X
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
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedTag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tag', selectedTag);
      if (search) params.append('search', search);
      
      const apiUrl = `/api/posts?${params}`;
      console.log('Fetching posts from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error('Failed to fetch posts:', response.status);
        return;
      }
      
      const data = await response.json();
      console.log('Fetched posts:', data.posts?.length || 0);
      
      setPosts(data.posts || []);
      setFeaturedPosts(data.featuredPosts || []);
      setCategories(data.categories || []);
      setTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearch('');
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
              Blog & Articles
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover insights, tutorials, and stories about web development, technology, and design.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-lg transition-all"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-orange-400 mr-2" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            {(selectedCategory || selectedTag) && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>
          
          {/* Categories */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  !selectedCategory
                    ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/20'
                    : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 border border-transparent'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/20'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 border border-transparent'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      selectedTag === tag
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-blue-300 border border-blue-500/20'
                        : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 border border-transparent'
                    }`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-orange-400 mr-2" />
                <h2 className="text-2xl font-bold">Featured Articles</h2>
              </div>
              <Link 
                href="/blog?featured=true"
                className="text-sm text-orange-400 hover:text-orange-300 flex items-center"
              >
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-orange-500/30 transition-all group"
                >
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-600/80 to-amber-600/80 text-white rounded">
                          Featured
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readingTime} min
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-orange-300 transition-colors">
                      <Link href={`/blog/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt || post.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        {post.authorName}
                      </div>
                      <Link 
                        href={`/blog/${post.id}`}
                        className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 text-orange-400 mr-2" />
              <h2 className="text-2xl font-bold">Latest Articles</h2>
            </div>
            <div className="text-sm text-gray-400">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading articles...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/70 transition-all group"
                >
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-2 py-1 text-xs bg-gray-800/80 text-gray-300 rounded">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readingTime} min
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-orange-300 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt || post.description}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded flex items-center"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-500 rounded">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Post Stats & Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        {post.authorName}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views?.toLocaleString() || 0}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {post.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedCategory || selectedTag ? 'No matching articles' : 'No articles yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {selectedCategory || selectedTag 
                  ? 'Try different filters or check back soon for new content.'
                  : 'Check back soon for new articles.'
                }
              </p>
              {(selectedCategory || selectedTag) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-600/50 text-white rounded-xl hover:from-gray-600/50 hover:to-gray-500/30 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}