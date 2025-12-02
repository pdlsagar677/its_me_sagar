"use client";

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageCircle,
  MoreVertical,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

type PostStatus = 'published' | 'draft' | 'scheduled';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  status: PostStatus;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  readTime: number;
  isFeatured: boolean;
}

export default function PostsPage() {
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: 'Getting Started with Next.js 14',
      excerpt: 'Learn how to build modern web applications with Next.js 14 and its new features including server components and caching.',
      author: 'SAGAR',
      date: 'Jan 15, 2024',
      status: 'published',
      category: 'Web Development',
      tags: ['Next.js', 'React', 'TypeScript'],
      views: 1250,
      likes: 89,
      comments: 12,
      readTime: 5,
      isFeatured: true
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS',
      excerpt: 'A comprehensive guide to Tailwind CSS utilities, best practices, and advanced techniques for modern web development.',
      author: 'SAGAR',
      date: 'Jan 10, 2024',
      status: 'published',
      category: 'CSS',
      tags: ['Tailwind', 'CSS', 'Design'],
      views: 890,
      likes: 45,
      comments: 8,
      readTime: 8,
      isFeatured: true
    },
    {
      id: 3,
      title: 'Building REST APIs with Node.js',
      excerpt: 'Create robust and scalable REST APIs using Node.js, Express, and modern JavaScript practices.',
      author: 'SAGAR',
      date: 'Jan 5, 2024',
      status: 'draft',
      category: 'Backend',
      tags: ['Node.js', 'Express', 'API'],
      views: 620,
      likes: 32,
      comments: 5,
      readTime: 10,
      isFeatured: false
    },
    {
      id: 4,
      title: 'TypeScript Best Practices',
      excerpt: 'Essential TypeScript patterns and best practices for writing maintainable and type-safe code.',
      author: 'SAGAR',
      date: 'Feb 1, 2024',
      status: 'published',
      category: 'TypeScript',
      tags: ['TypeScript', 'JavaScript', 'Best Practices'],
      views: 1120,
      likes: 67,
      comments: 15,
      readTime: 7,
      isFeatured: true
    },
    {
      id: 5,
      title: 'React Hooks Deep Dive',
      excerpt: 'Understanding React hooks from basics to advanced patterns with practical examples.',
      author: 'SAGAR',
      date: 'Coming Soon',
      status: 'scheduled',
      category: 'React',
      tags: ['React', 'Hooks', 'Frontend'],
      views: 0,
      likes: 0,
      comments: 0,
      readTime: 12,
      isFeatured: false
    },
    {
      id: 6,
      title: 'Database Design Patterns',
      excerpt: 'Common database design patterns and optimization techniques for modern applications.',
      author: 'SAGAR',
      date: 'Feb 10, 2024',
      status: 'draft',
      category: 'Database',
      tags: ['Database', 'SQL', 'Design Patterns'],
      views: 320,
      likes: 18,
      comments: 3,
      readTime: 15,
      isFeatured: false
    }
  ]);

  const statusFilters = [
    { id: 'all', label: 'All Posts', count: posts.length, color: 'bg-gray-500' },
    { id: 'published', label: 'Published', count: posts.filter(p => p.status === 'published').length, color: 'bg-green-500' },
    { id: 'draft', label: 'Draft', count: posts.filter(p => p.status === 'draft').length, color: 'bg-yellow-500' },
    { id: 'scheduled', label: 'Scheduled', count: posts.filter(p => p.status === 'scheduled').length, color: 'bg-blue-500' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleDeletePost = (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const handleToggleFeatured = (id: number) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, isFeatured: !post.isFeatured } : post
    ));
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'published': return 'bg-green-900/30 text-green-400';
      case 'draft': return 'bg-yellow-900/30 text-yellow-400';
      case 'scheduled': return 'bg-blue-900/30 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 mt-2">Manage your blog content and articles</p>
        </div>
        <button className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Create New Post
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: posts.length, icon: FileText, color: 'from-blue-500 to-cyan-500' },
          { label: 'Published', value: posts.filter(p => p.status === 'published').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Views', value: posts.reduce((sum, post) => sum + post.views, 0).toLocaleString(), icon: Eye, color: 'from-purple-500 to-pink-500' },
          { label: 'Featured', value: posts.filter(p => p.isFeatured).length, icon: TrendingUp, color: 'from-orange-500 to-amber-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}/20`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
              </div>
              <span className="text-sm font-medium text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                +{Math.floor(Math.random() * 15)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Filter:</span>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedStatus(filter.id as PostStatus | 'all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedStatus === filter.id
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/20'
                  : 'bg-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-600/30 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${filter.color}`}></div>
                <span>{filter.label}</span>
                <span className="px-1.5 py-0.5 text-xs bg-gray-600/50 rounded-full">{filter.count}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all group">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                  {post.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-900/30 to-amber-900/30 text-orange-300 rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
              
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => handleToggleFeatured(post.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.isFeatured 
                      ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/20' 
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-600/30'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600/30 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime} min read
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center text-gray-400">
                  <Eye className="w-4 h-4 mr-1" />
                  {post.views.toLocaleString()}
                </span>
                <span className="flex items-center text-gray-400">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white rounded-xl transition-colors text-sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/10 hover:from-blue-500/30 hover:to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-xl transition-colors text-sm">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                View Live
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Button */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
          <p className="text-gray-400 mb-6">Get started by creating your first blog post</p>
          <button className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Post
          </button>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/10 border border-orange-700/30 rounded-xl p-6">
        <div className="flex items-start">
          <BookOpen className="w-6 h-6 text-orange-400 mt-0.5 mr-3" />
          <div>
            <h4 className="font-bold text-white mb-2">Writing Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm text-gray-300">
                • Use descriptive titles that capture attention
              </div>
              <div className="text-sm text-gray-300">
                • Add relevant tags for better discoverability
              </div>
              <div className="text-sm text-gray-300">
                • Include images and code snippets for better engagement
              </div>
              <div className="text-sm text-gray-300">
                • Schedule posts for optimal publishing times
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}