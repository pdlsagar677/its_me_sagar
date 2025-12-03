'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/useAdminStore';
import { 
  Plus, 
  X, 
  Image as ImageIcon, 
  FileText, 
  Tag, 
  Globe,
  Sparkles,
  BookOpen,
  Clock,
  Upload,
  PenTool,
  Layout,
  Type,
  Save,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Check,
  ExternalLink
} from 'lucide-react';

interface EditPostFormProps {
  postId: string;
}

export default function EditPostForm({ postId }: EditPostFormProps) {
  const router = useRouter();
  const { 
    fetchPostById, 
    updatePost, 
    isLoading, 
    error, 
    clearError 
  } = useAdminStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    tags: [] as string[],
    isPublished: true,
    isFeatured: false,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [existingImage, setExistingImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadPostData();
  }, [postId]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      const post = await fetchPostById(postId);
      
      if (post) {
        setFormData({
          title: post.title || '',
          description: post.description || '',
          content: post.content || '',
          category: post.category || 'Technology',
          tags: post.tags || [],
          isPublished: post.isPublished || true,
          isFeatured: post.isFeatured || false,
        });
        
        if (post.coverImage) {
          setExistingImage(post.coverImage);
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewImage('');
    setExistingImage('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await updatePost(postId, {
        ...formData,
        image: image || undefined,
      });

      setSuccessMessage('Post updated successfully!');
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleViewLive = () => {
    router.push(`/blog/${postId}`);
  };

  const handleViewInList = () => {
    router.push('/admin/posts');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Notification - Toggle Style */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-800/10 backdrop-blur-sm border border-green-700/30 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{successMessage}</p>
                  <p className="text-green-300 text-sm mt-0.5">Changes saved and published</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleViewLive}
                  className="p-2 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded-lg transition-colors"
                  title="View live"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="p-2 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-green-500/20 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-green-500 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Post Preview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-xl border border-orange-500/20">
                <PenTool className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Post</h1>
                <p className="text-gray-400 mt-1">Update and refine your article</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin/posts')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-600/50 text-gray-300 rounded-xl hover:from-gray-600/50 hover:to-gray-500/30 hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Posts
              </button>
              <button
                type="button"
                onClick={handleViewLive}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-blue-500/30 text-blue-300 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/20 hover:text-blue-200 transition-all"
              >
                <Eye className="w-4 h-4" />
                View Live
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { 
                label: 'Status', 
                value: formData.isPublished ? 'Published' : 'Draft', 
                icon: Globe, 
                color: formData.isPublished ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-amber-500',
                subtext: formData.isPublished ? 'Live on site' : 'Not visible'
              },
              { 
                label: 'Category', 
                value: formData.category, 
                icon: BookOpen, 
                color: 'from-blue-500 to-cyan-500',
                subtext: 'Primary category'
              },
              { 
                label: 'Featured', 
                value: formData.isFeatured ? 'Yes' : 'No', 
                icon: TrendingUp, 
                color: formData.isFeatured ? 'from-purple-500 to-pink-500' : 'from-gray-500 to-gray-600',
                subtext: formData.isFeatured ? 'Featured post' : 'Regular post'
              },
              { 
                label: 'Last Updated', 
                value: 'Just now', 
                icon: Calendar, 
                color: 'from-orange-500 to-amber-500',
                subtext: 'Auto-saved'
              },
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 bg-gradient-to-r ${stat.color}/20 rounded-lg border ${stat.color}/30`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
                    {stat.label}
                  </span>
                </div>
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-700/30 text-red-300 px-6 py-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <strong className="font-medium">Error</strong>
          </div>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-lg border border-orange-500/20">
                    <Type className="w-5 h-5 text-orange-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Post Title</h2>
                </div>
                <div className="text-sm text-gray-400">
                  {formData.title.split(' ').filter(w => w.length > 0).length} words
                </div>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 bg-gray-800/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                placeholder="Enter post title..."
              />
            </div>

            {/* Description Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Description</h2>
                </div>
                <div className="text-sm text-gray-400">
                  {formData.description.length}/300
                </div>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-4 bg-gray-800/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Brief description of the post..."
              />
              <p className="text-gray-400 text-sm mt-3">
                <span className="text-blue-400 font-medium">SEO:</span> This appears in search results and social media previews
              </p>
            </div>

            {/* Content Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <PenTool className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Content</h2>
                </div>
                <div className="text-sm text-gray-400">
                  {formData.content.split(/\s+/).filter(w => w.length > 0).length} words
                </div>
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={16}
                className="w-full px-4 py-4 bg-gray-800/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm leading-relaxed resize-none"
                placeholder="Write your post content here..."
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-gray-400 text-sm">
                  <span className="text-purple-400 font-medium">Tip:</span> Use clear formatting for better readability
                </p>
                <span className="text-sm text-gray-500">{formData.content.length}/20000</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Image Upload Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-lg border border-emerald-500/20">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Cover Image</h2>
              </div>
              
              {(previewImage || existingImage) ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-gray-600/50">
                    <img
                      src={previewImage || existingImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:bg-gray-700/80 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-600/50 text-gray-300 rounded-lg cursor-pointer hover:from-gray-600/50 hover:to-gray-500/30 hover:text-white transition-all">
                      <Upload className="w-4 h-4" />
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-600/50 rounded-xl p-6 text-center hover:border-gray-500/50 transition-colors group cursor-pointer">
                  <div className="mb-4">
                    <div className="inline-flex p-4 bg-gradient-to-br from-gray-800/40 to-gray-700/20 rounded-xl border border-gray-600/50 group-hover:border-gray-500/50 transition-colors">
                      <Upload className="w-8 h-8 text-gray-500 group-hover:text-gray-400" />
                    </div>
                  </div>
                  <p className="text-gray-400 mb-2">Upload cover image</p>
                  <p className="text-gray-500 text-sm mb-4">Recommended: 1200×630px</p>
                  <label className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-600/50 text-gray-300 rounded-lg cursor-pointer hover:from-gray-600/50 hover:to-gray-500/30 hover:text-white transition-all">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Settings Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 rounded-lg border border-amber-500/20">
                  <Layout className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Post Settings</h2>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Technology">🚀 Technology</option>
                  <option value="Web Development">💻 Web Development</option>
                  <option value="Programming">⚡ Programming</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Personal">📝 Personal</option>
                  <option value="Tutorial">📚 Tutorial</option>
                  <option value="News">📰 News</option>
                </select>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2.5 bg-gray-800/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2.5 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-600/50 text-gray-300 rounded-xl hover:from-gray-600/50 hover:to-gray-500/30 hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Tags List */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border border-blue-500/20 text-blue-300 rounded-lg text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggle Settings */}
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-gray-800/20 rounded-xl border border-gray-700/30 cursor-pointer hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.isPublished ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-700/50 border border-gray-600/50'}`}>
                      <Globe className={`w-4 h-4 ${formData.isPublished ? 'text-green-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Published</p>
                      <p className="text-gray-400 text-sm">Make post visible to everyone</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.isPublished ? 'bg-green-500' : 'bg-gray-600'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.isPublished ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-800/20 rounded-xl border border-gray-700/30 cursor-pointer hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.isFeatured ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-gray-700/50 border border-gray-600/50'}`}>
                      <TrendingUp className={`w-4 h-4 ${formData.isFeatured ? 'text-purple-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Featured</p>
                      <p className="text-gray-400 text-sm">Highlight on homepage</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-purple-500' : 'bg-gray-600'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.isFeatured ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Save Changes</h3>
              <p className="text-gray-400 text-sm">
                Update your post with the latest changes
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin/posts')}
                className="px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-600/50 text-gray-300 rounded-xl hover:from-gray-600/50 hover:to-gray-500/30 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Post
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {formData.title.split(' ').filter(w => w.length > 0).length}
              </div>
              <div className="text-sm text-gray-400">Title Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {formData.content.split(/\s+/).filter(w => w.length > 0).length}
              </div>
              <div className="text-sm text-gray-400">Content Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {formData.tags.length}
              </div>
              <div className="text-sm text-gray-400">Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(previewImage || existingImage) ? '✓' : '—'}
              </div>
              <div className="text-sm text-gray-400">Cover Image</div>
            </div>
          </div>
        </div>
      </form>

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