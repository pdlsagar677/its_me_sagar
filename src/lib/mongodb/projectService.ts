import { connectToDatabase } from './connection';
import { ObjectId } from 'mongodb';
import { cloudinaryService } from '@/lib/cloudinary/cloudinary';

export interface Project {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  githubUrl?: string;
  projectUrl?: string;
  coverImage: string;
  coverImagePublicId?: string;
  screenshots: string[];
  isFeatured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  featuredTechnologies: string[];
  projectDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  githubUrl?: string;
  projectUrl?: string;
  coverImage?: string;
  isFeatured?: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  featuredTechnologies?: string[];
  projectDate?: Date;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  shortDescription?: string;
  technologies?: string[];
  githubUrl?: string;
  projectUrl?: string;
  isFeatured?: boolean;
  status?: 'completed' | 'in-progress' | 'planned';
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  featuredTechnologies?: string[];
  projectDate?: Date;
}

const PROJECTS_COLLECTION = 'projects';

export const generateProjectId = (): string => {
  return 'project_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const projectService = {
// Get all projects
async getAllProjects(status?: 'completed' | 'in-progress' | 'planned'): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    const query = status ? { status } : {};
    const projects = await db.collection<Project>(PROJECTS_COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return { success: true, projects };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: 'Failed to fetch projects' };
  }
},
  // Get featured projects
  async getFeaturedProjects(): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const projects = await db.collection<Project>(PROJECTS_COLLECTION)
        .find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();
      
      return { success: true, projects };
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return { success: false, error: 'Failed to fetch featured projects' };
    }
  },

  // Get project by ID
  async getProjectById(projectId: string): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const project = await db.collection<Project>(PROJECTS_COLLECTION).findOne({ id: projectId });
      
      if (!project) {
        return { success: false, error: 'Project not found' };
      }
      
      return { success: true, project };
    } catch (error) {
      console.error('Error fetching project:', error);
      return { success: false, error: 'Failed to fetch project' };
    }
  },

  // Create project
  async createProject(projectData: CreateProjectData): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const newProject: Project = {
        id: generateProjectId(),
        title: projectData.title,
        description: projectData.description,
        shortDescription: projectData.shortDescription,
        technologies: projectData.technologies || [],
        githubUrl: projectData.githubUrl,
        projectUrl: projectData.projectUrl,
        coverImage: projectData.coverImage || '',
        coverImagePublicId: '',
        screenshots: [],
        isFeatured: projectData.isFeatured || false,
        status: projectData.status || 'completed',
        complexity: projectData.complexity || 'intermediate',
        featuredTechnologies: projectData.featuredTechnologies || [],
        projectDate: projectData.projectDate || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection<Project>(PROJECTS_COLLECTION).insertOne(newProject);
      newProject._id = result.insertedId;
      
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, error: 'Failed to create project' };
    }
  },

  // Update project
  async updateProject(projectId: string, updates: UpdateProjectData): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      const result = await db.collection<Project>(PROJECTS_COLLECTION).findOneAndUpdate(
        { id: projectId },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Project not found' };
      }
      
      return { success: true, project: result };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: 'Failed to update project' };
    }
  },

  // Upload project cover image
  async uploadCoverImage(projectId: string, imageBuffer: Buffer, fileName: string): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Get current project to delete old image
      const currentProject = await db.collection<Project>(PROJECTS_COLLECTION).findOne({ id: projectId });
      if (currentProject?.coverImagePublicId) {
        try {
          await cloudinaryService.deleteImage(currentProject.coverImagePublicId);
        } catch (error) {
          console.error('Error deleting old project image:', error);
        }
      }
      
      // Upload new image to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(imageBuffer, 'portfolio/projects');
      
      // Update project with new image
      const result = await db.collection<Project>(PROJECTS_COLLECTION).findOneAndUpdate(
        { id: projectId },
        { 
          $set: { 
            coverImage: uploadResult.secure_url,
            coverImagePublicId: uploadResult.public_id,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Project not found' };
      }
      
      return { success: true, project: result };
    } catch (error) {
      console.error('Error uploading project image:', error);
      return { success: false, error: 'Failed to upload project image' };
    }
  },

  // Upload project screenshots
  async uploadScreenshot(projectId: string, imageBuffer: Buffer, fileName: string): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Upload screenshot to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(imageBuffer, 'portfolio/projects/screenshots');
      
      // Add screenshot to project
      const result = await db.collection<Project>(PROJECTS_COLLECTION).findOneAndUpdate(
        { id: projectId },
        { 
          $push: { 
            screenshots: uploadResult.secure_url
          },
          $set: {
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return { success: false, error: 'Project not found' };
      }
      
      return { success: true, project: result };
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      return { success: false, error: 'Failed to upload screenshot' };
    }
  },

  // Delete project
  async deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Get project to delete images
      const project = await db.collection<Project>(PROJECTS_COLLECTION).findOne({ id: projectId });
      
      if (project) {
        // Delete cover image from Cloudinary
        if (project.coverImagePublicId) {
          try {
            await cloudinaryService.deleteImage(project.coverImagePublicId);
          } catch (error) {
            console.error('Error deleting project cover image:', error);
          }
        }
        
        // Delete screenshots from Cloudinary
        // Note: You might want to store screenshot public IDs separately
      }
      
      const result = await db.collection<Project>(PROJECTS_COLLECTION).deleteOne({ id: projectId });
      
      if (result.deletedCount === 0) {
        return { success: false, error: 'Project not found' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: 'Failed to delete project' };
    }
  },

  // Delete cover image
  async deleteCoverImage(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const currentProject = await db.collection<Project>(PROJECTS_COLLECTION).findOne({ id: projectId });
      
      if (!currentProject) {
        return { success: false, error: 'Project not found' };
      }
      
      if (currentProject.coverImagePublicId) {
        await cloudinaryService.deleteImage(currentProject.coverImagePublicId);
      }
      
      const result = await db.collection<Project>(PROJECTS_COLLECTION).findOneAndUpdate(
        { id: projectId },
        { 
          $set: { 
            coverImage: '',
            coverImagePublicId: '',
            updatedAt: new Date()
          } 
        }
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting project image:', error);
      return { success: false, error: 'Failed to delete project image' };
    }
  },

  // Delete screenshot
  async deleteScreenshot(projectId: string, screenshotUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection<Project>(PROJECTS_COLLECTION).findOneAndUpdate(
        { id: projectId },
        { 
          $pull: { 
            screenshots: screenshotUrl
          },
          $set: {
            updatedAt: new Date()
          }
        }
      );
      
      if (!result) {
        return { success: false, error: 'Project not found' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      return { success: false, error: 'Failed to delete screenshot' };
    }
  },

  // Get projects statistics
  async getProjectsStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      const totalProjects = await db.collection<Project>(PROJECTS_COLLECTION).countDocuments();
      const completedProjects = await db.collection<Project>(PROJECTS_COLLECTION).countDocuments({ status: 'completed' });
      const featuredProjects = await db.collection<Project>(PROJECTS_COLLECTION).countDocuments({ isFeatured: true });
      
      const stats = {
        total: totalProjects,
        completed: completedProjects,
        inProgress: await db.collection<Project>(PROJECTS_COLLECTION).countDocuments({ status: 'in-progress' }),
        planned: await db.collection<Project>(PROJECTS_COLLECTION).countDocuments({ status: 'planned' }),
        featured: featuredProjects,
        beginner: await db.collection<Project>(PROJECTS_COLLECTION).countDocuments({ complexity: 'beginner' }),
        intermediate: await db.collection<Project>(PROJECTS_COLLECTION).countDocuments({ complexity: 'intermediate' }),
        advanced: await db.collection<Project>(PROJECTS_COLLECTION).countDocuments({ complexity: 'advanced' })
      };
      
      return { success: true, stats };
    } catch (error) {
      console.error('Error fetching projects stats:', error);
      return { success: false, error: 'Failed to fetch projects statistics' };
    }
  }
};