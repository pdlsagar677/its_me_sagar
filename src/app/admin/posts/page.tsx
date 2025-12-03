"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  ArrowUpRight,
  BookOpen,
  Heart,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';

export default function PostsPage() {
  const router = useRouter();
  const { 
    posts, 
    isLoading, 
    error,
    fetchAllPosts, 
    deletePost
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [deletedPostTitle, setDeletedPostTitle] = useState('');

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  // Auto-hide success messages
  useEffect(() => {
    if (showDeleteSuccess) {
      const timer = setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showDeleteSuccess]);

  useEffect(() => {
    if (showCreateSuccess) {
      const timer = setTimeout(() => {
        setShowCreateSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showCreateSuccess]);

  const handleCreatePost = () => {
    router.push('/admin/create-post');
  };

  const handleEditPost = (id: string) => {
    router.push(`/admin/posts/edit/${id}`);
  };

  const handleViewLive = (id: string) => {
    router.push(`/blog/${id}`);
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    try {
      await deletePost(postId);
      setDeletedPostTitle(postTitle);
      setShowDeleteSuccess(true);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        (post.description && post.description.toLowerCase().includes(query)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Notifications */}
      {showDeleteSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 backdrop-blur-sm border border-red-700/30 rounded-xl p-4 shadow-2xl max-w-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                  <Check className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Post deleted</p>
                  <p className="text-red-300 text-sm mt-0.5">"{deletedPostTitle}" has been removed</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteSuccess(false)}
                className="p-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-red-500/20 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-red-500 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      {showCreateSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-800/10 backdrop-blur-sm border border-green-700/30 rounded-xl p-4 shadow-2xl max-w-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Post created</p>
                  <p className="text-green-300 text-sm mt-0.5">New post published successfully</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateSuccess(false)}
                className="p-2 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-green-500/20 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-green-500 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 mt-2">All your published blog posts</p>
        </div>
        <button 
          onClick={handleCreatePost}
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Post
        </button>
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Posts', value: posts.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Views', value: posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString(), color: 'from-purple-500 to-pink-500' },
          { label: 'Total Likes', value: posts.reduce((sum, post) => sum + (post.likes || 0), 0).toLocaleString(), color: 'from-orange-500 to-amber-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-700/30 text-red-300 px-6 py-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5" />
            <strong className="font-medium">Error</strong>
          </div>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all group">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-green-900/30 text-green-400 rounded-full">
                      Published
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt || post.description?.substring(0, 150) + '...'}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <button 
                    onClick={() => handleEditPost(post.id)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600/30 rounded-lg transition-colors"
                    title="Edit post"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600/30 rounded-lg transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {(!post.tags || post.tags.length === 0) && (
                    <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-500 rounded">
                      No tags
                    </span>
                  )}
                </div>
              </div>

              {/* Post Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.authorName}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {post.readingTime || 5} min read
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center text-gray-400">
                    <Eye className="w-4 h-4 mr-1" />
                    {post.views?.toLocaleString() || 0}
                  </span>
                  <span className="flex items-center text-gray-400">
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes || 0}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex items-center gap-2">
                <button 
                  onClick={() => handleViewLive(post.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/10 hover:from-blue-500/30 hover:to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-xl transition-colors text-sm"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  View Live
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'No matching posts found' : 'No posts yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery 
              ? 'Try a different search term' 
              : 'Create your first blog post'
            }
          </p>
          <button 
            onClick={handleCreatePost}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Post
          </button>
        </div>
      )}

      {/* Quick Tips */}
      {filteredPosts.length > 0 && (
        <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/10 border border-orange-700/30 rounded-xl p-6">
          <div className="flex items-start">
            <BookOpen className="w-6 h-6 text-orange-400 mt-0.5 mr-3" />
            <div>
              <h4 className="font-bold text-white mb-2">Writing Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm text-gray-300">
                  • Use clear, descriptive titles
                </div>
                <div className="text-sm text-gray-300">
                  • Add relevant tags for discoverability
                </div>
                <div className="text-sm text-gray-300">
                  • Include images for better engagement
                </div>
                <div className="text-sm text-gray-300">
                  • Keep content clear and concise
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-progress-bar {
          animation: progress-bar 5s linear forwards;
        }
      `}</style>
    </div>
  );
}