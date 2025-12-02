import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  authorId: string;
  authorName: string;
  views: number;
  likes: number;
  comments: number;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  coverImage: string;
  screenshots: string[];
  isFeatured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  featuredPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  portfolioVisits: number;
  averageEngagement: number;
}

interface AdminState {
  // State
  posts: BlogPost[];
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  stats: DashboardStats;
  recentActivity: any[];
  
  // Post Management
  fetchAllPosts: () => Promise<void>;
  fetchPostsByStatus: (status: 'published' | 'draft' | 'featured') => Promise<void>;
  fetchPostById: (postId: string) => Promise<BlogPost | null>;
  createPost: (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'>) => Promise<BlogPost>;
  updatePost: (postId: string, updates: Partial<BlogPost>) => Promise<BlogPost>;
  deletePost: (postId: string) => Promise<void>;
  publishPost: (postId: string) => Promise<void>;
  unpublishPost: (postId: string) => Promise<void>;
  toggleFeatured: (postId: string) => Promise<void>;
  
  // Project Management
  fetchAllProjects: () => Promise<void>;
  fetchProjectsByStatus: (status: Project['status']) => Promise<void>;
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  toggleProjectFeatured: (projectId: string) => Promise<void>;
  
  // Analytics
  fetchStats: () => Promise<void>;
  fetchRecentActivity: () => Promise<void>;
  updatePortfolioVisits: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  generateSlug: (title: string) => string;
  calculateReadingTime: (content: string) => number;
}

const defaultStats: DashboardStats = {
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  featuredPosts: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0,
  totalProjects: 0,
  activeProjects: 0,
  completedProjects: 0,
  portfolioVisits: 0,
  averageEngagement: 0,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial State
      posts: [],
      projects: [],
      isLoading: false,
      error: null,
      stats: defaultStats,
      recentActivity: [],

      // Post Management
      fetchAllPosts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/posts', {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch posts');
          }
          
          const data = await response.json();
          set({ posts: data.posts, isLoading: false });
        } catch (error) {
          console.error('Fetch posts error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch posts',
            isLoading: false 
          });
        }
      },

      fetchPostsByStatus: async (status) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/posts?status=${status}`, {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch posts');
          }
          
          const data = await response.json();
          set({ posts: data.posts, isLoading: false });
        } catch (error) {
          console.error('Fetch posts error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch posts',
            isLoading: false 
          });
        }
      },

      fetchPostById: async (postId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/posts/${postId}`, {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch post');
          }
          
          const data = await response.json();
          set({ isLoading: false });
          return data.post;
        } catch (error) {
          console.error('Fetch post error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch post',
            isLoading: false 
          });
          return null;
        }
      },

      createPost: async (postData) => {
        set({ isLoading: true, error: null });
        try {
          // Generate slug and reading time
          const slug = get().generateSlug(postData.title);
          const readingTime = get().calculateReadingTime(postData.content);
          
          const postWithMetadata = {
            ...postData,
            slug,
            readingTime,
            views: 0,
            likes: 0,
            comments: 0,
          };

          const response = await fetch('/api/admin/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(postWithMetadata),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create post');
          }
          
          const data = await response.json();
          
          // Add to local state
          const { posts } = get();
          set({ 
            posts: [data.post, ...posts], 
            isLoading: false 
          });
          
          // Update stats
          get().fetchStats();
          get().fetchRecentActivity();
          
          return data.post;
        } catch (error) {
          console.error('Create post error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create post',
            isLoading: false 
          });
          throw error;
        }
      },

      updatePost: async (postId: string, updates: Partial<BlogPost>) => {
        set({ isLoading: true, error: null });
        try {
          // If title is updated, generate new slug
          if (updates.title) {
            updates.slug = get().generateSlug(updates.title);
          }
          
          // If content is updated, calculate new reading time
          if (updates.content) {
            updates.readingTime = get().calculateReadingTime(updates.content);
          }

          const response = await fetch(`/api/admin/posts/${postId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updates),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update post');
          }
          
          const data = await response.json();
          
          // Update local state
          const { posts } = get();
          const updatedPosts = posts.map(post => 
            post.id === postId ? { ...post, ...updates, updatedAt: new Date() } : post
          );
          
          set({ posts: updatedPosts, isLoading: false });
          get().fetchRecentActivity();
          
          return data.post;
        } catch (error) {
          console.error('Update post error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update post',
            isLoading: false 
          });
          throw error;
        }
      },

      deletePost: async (postId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete post');
          }
          
          // Remove from local state
          const { posts } = get();
          const updatedPosts = posts.filter(post => post.id !== postId);
          
          set({ posts: updatedPosts, isLoading: false });
          
          // Update stats
          get().fetchStats();
          get().fetchRecentActivity();
        } catch (error) {
          console.error('Delete post error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete post',
            isLoading: false 
          });
          throw error;
        }
      },

      publishPost: async (postId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/posts/${postId}/publish`, {
            method: 'PUT',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to publish post');
          }
          
          const data = await response.json();
          
          // Update local state
          const { posts } = get();
          const updatedPosts = posts.map(post => 
            post.id === postId ? { ...post, isPublished: true, updatedAt: new Date() } : post
          );
          
          set({ posts: updatedPosts, isLoading: false });
          get().fetchStats();
          get().fetchRecentActivity();
        } catch (error) {
          console.error('Publish post error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to publish post',
            isLoading: false 
          });
          throw error;
        }
      },

      unpublishPost: async (postId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/posts/${postId}/unpublish`, {
            method: 'PUT',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to unpublish post');
          }
          
          const data = await response.json();
          
          // Update local state
          const { posts } = get();
          const updatedPosts = posts.map(post => 
            post.id === postId ? { ...post, isPublished: false, updatedAt: new Date() } : post
          );
          
          set({ posts: updatedPosts, isLoading: false });
          get().fetchStats();
        } catch (error) {
          console.error('Unpublish post error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to unpublish post',
            isLoading: false 
          });
          throw error;
        }
      },

      toggleFeatured: async (postId: string) => {
        set({ isLoading: true, error: null });
        try {
          const post = get().posts.find(p => p.id === postId);
          if (!post) throw new Error('Post not found');

          const response = await fetch(`/api/admin/posts/${postId}/featured`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ featured: !post.isFeatured }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to toggle featured status');
          }
          
          const data = await response.json();
          
          // Update local state
          const { posts } = get();
          const updatedPosts = posts.map(post => 
            post.id === postId ? { ...post, isFeatured: !post.isFeatured, updatedAt: new Date() } : post
          );
          
          set({ posts: updatedPosts, isLoading: false });
          get().fetchStats();
        } catch (error) {
          console.error('Toggle featured error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to toggle featured status',
            isLoading: false 
          });
          throw error;
        }
      },

      // Project Management
      fetchAllProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/projects', {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch projects');
          }
          
          const data = await response.json();
          set({ projects: data.projects, isLoading: false });
        } catch (error) {
          console.error('Fetch projects error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch projects',
            isLoading: false 
          });
        }
      },

      fetchProjectsByStatus: async (status) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/projects?status=${status}`, {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch projects');
          }
          
          const data = await response.json();
          set({ projects: data.projects, isLoading: false });
        } catch (error) {
          console.error('Fetch projects error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch projects',
            isLoading: false 
          });
        }
      },

      createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(projectData),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create project');
          }
          
          const data = await response.json();
          
          // Add to local state
          const { projects } = get();
          set({ 
            projects: [data.project, ...projects], 
            isLoading: false 
          });
          
          // Update stats
          get().fetchStats();
          get().fetchRecentActivity();
          
          return data.project;
        } catch (error) {
          console.error('Create project error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create project',
            isLoading: false 
          });
          throw error;
        }
      },

      updateProject: async (projectId: string, updates: Partial<Project>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/projects/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updates),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update project');
          }
          
          const data = await response.json();
          
          // Update local state
          const { projects } = get();
          const updatedProjects = projects.map(project => 
            project.id === projectId ? { ...project, ...updates, updatedAt: new Date() } : project
          );
          
          set({ projects: updatedProjects, isLoading: false });
          get().fetchRecentActivity();
          
          return data.project;
        } catch (error) {
          console.error('Update project error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update project',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteProject: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/admin/projects/${projectId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete project');
          }
          
          // Remove from local state
          const { projects } = get();
          const updatedProjects = projects.filter(project => project.id !== projectId);
          
          set({ projects: updatedProjects, isLoading: false });
          
          // Update stats
          get().fetchStats();
          get().fetchRecentActivity();
        } catch (error) {
          console.error('Delete project error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete project',
            isLoading: false 
          });
          throw error;
        }
      },

      toggleProjectFeatured: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const project = get().projects.find(p => p.id === projectId);
          if (!project) throw new Error('Project not found');

          const response = await fetch(`/api/admin/projects/${projectId}/featured`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ featured: !project.isFeatured }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to toggle featured status');
          }
          
          const data = await response.json();
          
          // Update local state
          const { projects } = get();
          const updatedProjects = projects.map(project => 
            project.id === projectId ? { ...project, isFeatured: !project.isFeatured, updatedAt: new Date() } : project
          );
          
          set({ projects: updatedProjects, isLoading: false });
          get().fetchStats();
        } catch (error) {
          console.error('Toggle project featured error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to toggle featured status',
            isLoading: false 
          });
          throw error;
        }
      },

      // Analytics
      fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/stats', {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch stats');
          }
          
          const data = await response.json();
          set({ stats: data.stats, isLoading: false });
        } catch (error) {
          console.error('Fetch stats error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch stats',
            isLoading: false 
          });
        }
      },

      fetchRecentActivity: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/activity', {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch activity');
          }
          
          const data = await response.json();
          set({ recentActivity: data.activity, isLoading: false });
        } catch (error) {
          console.error('Fetch activity error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch activity',
            isLoading: false 
          });
        }
      },

      updatePortfolioVisits: async () => {
        try {
          await fetch('/api/admin/stats/visits', {
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Update visits error:', error);
        }
      },

      // Utility Functions
      clearError: () => set({ error: null }),

      generateSlug: (title: string) => {
        return title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
      },

      calculateReadingTime: (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return readingTime < 1 ? 1 : readingTime;
      },
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        posts: state.posts,
        projects: state.projects,
        stats: state.stats,
      }),
    }
  )
);