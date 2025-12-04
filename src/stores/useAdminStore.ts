// store/adminStore.ts
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
  coverImagePublicId?: string;
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
  coverImagePublicId?: string;
  screenshots: string[];
  isFeatured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  bio: string;
  profileImage: string;
  profileImagePublicId: string;
  coverImage: string;
  coverImagePublicId: string;
  cvUrl: string;
  cvPublicId: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    website: string;
    youtube: string;
    dribbble: string;
    behance: string;
    medium: string;
    stackoverflow: string;
  };
  experience: {
    years: number;
    title: string;
    description: string;
    projectsCompleted: number;
    clientsCount: number;
    companies: {
      name: string;
      position: string;
      duration: string;
      description: string;
    }[];
  };
  technologies: string[];
  skills: {
    category: string;
    items: string[];
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    description: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
    url: string;
  }[];
  stats: {
    postsCount: number;
    projectsCount: number;
    servicesCount: number;
    viewsCount: number;
    githubRepos: number;
    githubStars: number;
  };
  location: string;
  availability: boolean;
  hourlyRate?: number;
  contactEmail: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminState {
  // State
  posts: BlogPost[];
  projects: Project[];
  profile: Profile | null;
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
  
  // Profile Management
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
  
  // Profile Media Upload
  uploadProfileImage: (file: File) => Promise<Profile>;
  uploadCoverImage: (file: File) => Promise<Profile>;
  uploadCV: (file: File) => Promise<Profile>;
  
  // Profile Delete Media
  deleteProfileImage: () => Promise<void>;
  deleteCoverImage: () => Promise<void>;
  deleteCV: () => Promise<void>;
  
  // Social Links
  updateSocialLinks: (socialLinks: Partial<Profile['socialLinks']>) => Promise<Profile>;
  
  // Skills & Technologies
  updateSkills: (skills: Profile['skills']) => Promise<Profile>;
  updateTechnologies: (technologies: string[]) => Promise<Profile>;
  
  // Experience
  updateExperience: (experience: Partial<Profile['experience']>) => Promise<Profile>;
  
  // Education & Certifications
  updateEducation: (education: Profile['education']) => Promise<Profile>;
  updateCertifications: (certifications: Profile['certifications']) => Promise<Profile>;
  
  // Profile Status
  toggleProfilePublish: (isPublished: boolean) => Promise<Profile>;
  
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
      profile: null,
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
          const slug = get().generateSlug(postData.title);
          const readingTime = get().calculateReadingTime(postData.content);
          const excerpt = postData.excerpt || postData.description.substring(0, 150) + '...';

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
          
          Object.entries(updates).forEach(([key, value]) => {
            if (key !== 'image' && value !== undefined) {
              if (key === 'tags' && Array.isArray(value)) {
                formData.append(key, value.join(','));
              } else {
                formData.append(key, String(value));
              }
            }
          });
          
          if (updates.image) {
            formData.append('image', updates.image);
          }
          
          if (updates.title) {
            const slug = get().generateSlug(updates.title);
            formData.append('slug', slug);
          }
          
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

      // Profile Management
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch profile');
          }
          
          const data = await response.json();
          set({ profile: data.profile, isLoading: false });
        } catch (error) {
          console.error('Fetch profile error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch profile',
            isLoading: false 
          });
        }
      },

      // Update Profile
      updateProfile: async (updates: Partial<Profile>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'update-basic',
              ...updates 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update profile');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update profile error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update Social Links
      updateSocialLinks: async (socialLinks: Partial<Profile['socialLinks']>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'update-social',
              socialLinks 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update social links');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update social links error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update social links',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update Skills
      updateSkills: async (skills: Profile['skills']) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'update-skills',
              skills 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update skills');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update skills error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update skills',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update Technologies
      updateTechnologies: async (technologies: string[]) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'update-technologies',
              technologies 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update technologies');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update technologies error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update technologies',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update Experience
      updateExperience: async (experience: Partial<Profile['experience']>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'update-experience',
              experience 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update experience');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update experience error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update experience',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update Education
      updateEducation: async (education: Profile['education']) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'update-education',
              education 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update education');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update education error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update education',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update Certifications
      updateCertifications: async (certifications: Profile['certifications']) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'update-certifications',
              certifications 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update certifications');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update certifications error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update certifications',
            isLoading: false 
          });
          throw error;
        }
      },

      // Profile Media Upload
      uploadProfileImage: async (file: File) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('action', 'upload-profile-image');
          
          const response = await fetch('/api/admin/profile', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload profile image');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Upload profile image error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to upload profile image',
            isLoading: false 
          });
          throw error;
        }
      },

      uploadCoverImage: async (file: File) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('action', 'upload-cover-image');
          
          const response = await fetch('/api/admin/profile', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload cover image');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Upload cover image error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to upload cover image',
            isLoading: false 
          });
          throw error;
        }
      },

      uploadCV: async (file: File) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('cv', file);
          formData.append('action', 'upload-cv');
          
          const response = await fetch('/api/admin/profile', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload CV');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Upload CV error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to upload CV',
            isLoading: false 
          });
          throw error;
        }
      },

      // Profile Delete Media
      deleteProfileImage: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile?action=delete-profile-image', {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete profile image');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Delete profile image error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete profile image',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteCoverImage: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile?action=delete-cover-image', {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete cover image');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Delete cover image error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete cover image',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteCV: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile?action=delete-cv', {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete CV');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Delete CV error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete CV',
            isLoading: false 
          });
          throw error;
        }
      },

      // Profile Status
      toggleProfilePublish: async (isPublished: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              action: 'toggle-publish', 
              isPublished 
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update profile status');
          }
          
          const data = await response.json();
          
          set({ 
            profile: data.profile, 
            isLoading: false 
          });
          
          return data.profile;
        } catch (error) {
          console.error('Update profile status error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile status',
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
        profile: state.profile,
      }),
    }
  )
);