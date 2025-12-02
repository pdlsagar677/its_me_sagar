import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  description: string;
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

interface AdminState {
  // State
  posts: BlogPost[];
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  
  // Post Management
  fetchAllPosts: () => Promise<void>;
  fetchPostById: (postId: string) => Promise<BlogPost | null>;
  createPost: (postData: {
    title: string;
    description: string;
    content: string;
    excerpt?: string;
    image?: File;
    category: string;
    tags: string[];
    isPublished: boolean;
    isFeatured: boolean;
  }) => Promise<BlogPost>;
  updatePost: (postId: string, updates: Partial<BlogPost> & { image?: File }) => Promise<BlogPost>;
  deletePost: (postId: string) => Promise<void>;
  
  // Project Management
  fetchAllProjects: () => Promise<void>;
  fetchProjectsByStatus: (status: Project['status']) => Promise<void>;
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
  generateSlug: (title: string) => string;
  calculateReadingTime: (content: string) => number;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial State
      posts: [],
      projects: [],
      isLoading: false,
      error: null,

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
          const excerpt = postData.excerpt || postData.description.substring(0, 150) + '...';

          // Create FormData for file upload
          const formData = new FormData();
          formData.append('title', postData.title);
          formData.append('description', postData.description);
          formData.append('content', postData.content);
          formData.append('excerpt', excerpt);
          formData.append('category', postData.category);
          formData.append('tags', postData.tags.join(','));
          formData.append('isPublished', postData.isPublished.toString());
          formData.append('isFeatured', postData.isFeatured.toString());
          formData.append('slug', slug);
          formData.append('readingTime', readingTime.toString());
          
          if (postData.image) formData.append('image', postData.image);

          const response = await fetch('/api/admin/posts', {
            method: 'POST',
            credentials: 'include',
            body: formData,
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

      updatePost: async (postId: string, updates: Partial<BlogPost> & { image?: File }) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          
          // Add text fields to formData
          Object.entries(updates).forEach(([key, value]) => {
            if (key !== 'image' && value !== undefined) {
              if (key === 'tags' && Array.isArray(value)) {
                formData.append(key, value.join(','));
              } else {
                formData.append(key, String(value));
              }
            }
          });
          
          // Handle image upload
          if (updates.image) {
            formData.append('image', updates.image);
          }
          
          // If title is updated, generate new slug
          if (updates.title) {
            const slug = get().generateSlug(updates.title);
            formData.append('slug', slug);
          }
          
          // If content is updated, calculate new reading time
          if (updates.content) {
            const readingTime = get().calculateReadingTime(updates.content);
            formData.append('readingTime', readingTime.toString());
          }

          const response = await fetch(`/api/admin/posts/${postId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData,
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
        } catch (error) {
          console.error('Delete post error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete post',
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
        } catch (error) {
          console.error('Delete project error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete project',
            isLoading: false 
          });
          throw error;
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
      }),
    }
  )
);