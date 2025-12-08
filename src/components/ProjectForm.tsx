"use client";

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import { 
  FolderOpen,
  Plus,
  Save,
  Edit,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code,
  Calendar,
  Tag,
  Users,
  Globe,
  Eye,
  EyeOff,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Define the Project interface locally to match what the component expects
interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  category: string;
  tags: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  isPublished: boolean;
  images: string[];
  year: string;
  client?: string;
  role?: string;
  duration?: string;
}

// Helper function to convert File to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to convert multiple files to base64
const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
  const base64Promises = files.map(convertFileToBase64);
  return await Promise.all(base64Promises);
};

const ProjectsManagement = () => {
  const { 
    projects = [],
    fetchAllProjects,
    createProject, 
    updateProject, 
    deleteProject,
    isLoading 
  } = useAdminStore();

  // Project state - initialize with projects from store
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  // Editing states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  
  // Store new images being uploaded during edit
  const [newImagesForEdit, setNewImagesForEdit] = useState<Record<string, File[]>>({});

  // New project form state
  const [newProject, setNewProject] = useState<{
    title: string;
    description: string;
    detailedDescription: string;
    category: string;
    tags: string[];
    technologies: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    isPublished: boolean;
    year: string;
    client: string;
    role: string;
    duration: string;
  }>({
    title: '',
    description: '',
    detailedDescription: '',
    category: '',
    tags: [],
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    isPublished: false,
    year: new Date().getFullYear().toString(),
    client: '',
    role: '',
    duration: ''
  });

  // Add form states
  const [newTag, setNewTag] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Load projects on mount
  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // Populate projects when data loads
  useEffect(() => {
    if (projects && projects.length > 0) {
      // Map store projects to component's expected format
      const mappedProjects = projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.shortDescription || project.description.substring(0, 150) + '...',
        detailedDescription: project.description || '',
        category: project.complexity || 'intermediate',
        tags: project.featuredTechnologies || [],
        technologies: project.technologies || [],
        liveUrl: project.projectUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.isFeatured || false,
        isPublished: true,
        images: project.screenshots || [],
        year: project.projectDate ? new Date(project.projectDate).getFullYear().toString() : new Date().getFullYear().toString(),
        client: '',
        role: '',
        duration: ''
      }));
      setProjectsList(mappedProjects);
    } else {
      setProjectsList([]);
    }
  }, [projects]);

  // Handle input changes for new project
  const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle input changes for editing project
  const handleProjectChange = (id: string, field: string, value: any) => {
    setProjectsList(prev => 
      prev.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !newProject.tags.includes(newTag.trim())) {
      setNewProject(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      toast.success('Tag added');
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setNewProject(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Add technology
  const addTechnology = () => {
    if (newTechnology.trim() && !newProject.technologies.includes(newTechnology.trim())) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
      toast.success('Technology added');
    }
  };

  // Remove technology
  const removeTechnology = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  // Handle image upload for new project
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setProjectImages(prev => [...prev, ...files]);
      toast.success(`${files.length} image(s) selected`);
    }
  };

  // Remove image from new project form
  const removeImage = (index: number) => {
    setProjectImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const createProjectHandler = async () => {
    try {
      // Validate required fields
      if (!newProject.title.trim() || !newProject.description.trim()) {
        toast.error('Title and description are required');
        return;
      }

      let coverImage = '';
      let screenshots: string[] = [];

      // Convert images to base64 for database storage
      if (projectImages.length > 0) {
        try {
          // Convert all images to base64
          const base64Images = await convertFilesToBase64(projectImages);
          
          // First image as cover, all images as screenshots
          coverImage = base64Images[0] || '';
          screenshots = base64Images;
          
          console.log(`Converted ${base64Images.length} images to base64`);
        } catch (error) {
          console.error('Error converting images to base64:', error);
          toast.error('Failed to process images');
          return;
        }
      }

      // Create project object matching store interface
      const projectData = {
        title: newProject.title,
        description: newProject.detailedDescription || newProject.description,
        shortDescription: newProject.description,
        technologies: newProject.technologies,
        githubUrl: newProject.githubUrl || undefined,
        projectUrl: newProject.liveUrl || undefined,
        coverImage: coverImage,
        screenshots: screenshots,
        isFeatured: newProject.featured,
        status: 'completed' as const,
        complexity: (newProject.category.toLowerCase() as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
        featuredTechnologies: newProject.technologies.slice(0, 5),
        projectDate: new Date(`${newProject.year}-01-01`)
      };

      console.log('Creating project with data:', {
        ...projectData,
        coverImage: coverImage ? `Base64 image (${coverImage.length} chars)` : 'No cover image',
        screenshots: `${screenshots.length} screenshots`
      });

      // Add project to store
      await createProject(projectData);

      // Reset form
      setNewProject({
        title: '',
        description: '',
        detailedDescription: '',
        category: '',
        tags: [],
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        featured: false,
        isPublished: false,
        year: new Date().getFullYear().toString(),
        client: '',
        role: '',
        duration: ''
      });
      setProjectImages([]);
      setIsAddingProject(false);
      
      toast.success('Project added successfully');
    } catch (error) {
      console.error('Create project error:', error);
      toast.error('Failed to add project');
    }
  };

  // Update project - FIXED to handle new image uploads during edit
  const updateProjectHandler = async (id: string) => {
    try {
      const project = projectsList.find(p => p.id === id);
      if (!project) return;

      // Get new images for this project
      const newImagesFiles = newImagesForEdit[id] || [];
      let allImages = [...project.images];

      // Convert new images to base64 if any
      if (newImagesFiles.length > 0) {
        try {
          const base64Images = await convertFilesToBase64(newImagesFiles);
          allImages = [...project.images, ...base64Images];
          console.log(`Added ${base64Images.length} new images to project`);
        } catch (error) {
          console.error('Error converting new images:', error);
          toast.error('Failed to process new images');
          return;
        }
      }

      // Convert to store format
      const projectUpdate = {
        title: project.title,
        description: project.detailedDescription || project.description,
        shortDescription: project.description,
        technologies: project.technologies,
        githubUrl: project.githubUrl || undefined,
        projectUrl: project.liveUrl || undefined,
        isFeatured: project.featured,
        complexity: (project.category.toLowerCase() as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
        featuredTechnologies: project.technologies.slice(0, 5),
        coverImage: allImages[0] || '', // Use first image as cover
        screenshots: allImages || []
      };

      console.log('Updating project with data:', {
        ...projectUpdate,
        screenshotsCount: projectUpdate.screenshots.length
      });

      await updateProject(id, projectUpdate);
      
      // Clear the new images for this project after successful update
      setNewImagesForEdit(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      
      // Update local state with new images
      if (newImagesFiles.length > 0) {
        setProjectsList(prev => 
          prev.map(p => 
            p.id === id ? { ...p, images: allImages } : p
          )
        );
      }
      
      setEditingProjectId(null);
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Update project error:', error);
      toast.error('Failed to update project');
    }
  };

  // Delete project
  const deleteProjectHandler = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Delete project error:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  // Toggle project publish
  const togglePublish = (id: string) => {
    setProjectsList(prev => 
      prev.map(project => 
        project.id === id ? { ...project, isPublished: !project.isPublished } : project
      )
    );
    toast.success('Project status updated');
  };

  // Toggle project expansion
  const toggleProjectExpansion = (id: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Save all projects
  const saveAllProjects = async () => {
    try {
      // Save all edited projects
      const updatePromises = projectsList
        .filter(project => editingProjectId === project.id)
        .map(project => updateProjectHandler(project.id));
      
      await Promise.all(updatePromises);
      setEditingProjectId(null);
      toast.success('All changes saved successfully');
    } catch (error) {
      console.error('Save all error:', error);
      toast.error('Failed to save some projects');
    }
  };

  // Handle adding images to existing project during edit
  const handleAddImagesToProject = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Store files for later conversion when saving
      setNewImagesForEdit(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), ...files]
      }));
      toast.success(`${files.length} image(s) added for preview`);
    }
  };

  // Remove existing image from project
  const removeImageFromProject = (projectId: string, index: number) => {
    const project = projectsList.find(p => p.id === projectId);
    if (project) {
      const newImages = project.images.filter((_, i) => i !== index);
      handleProjectChange(projectId, 'images', newImages);
      toast.success('Image removed');
    }
  };

  // Add tag to project during edit
  const addTagToProject = (projectId: string, tag: string) => {
    const project = projectsList.find(p => p.id === projectId);
    if (project && tag.trim() && !project.tags.includes(tag.trim())) {
      const newTags = [...project.tags, tag.trim()];
      handleProjectChange(projectId, 'tags', newTags);
      toast.success('Tag added');
    }
  };

  // Add technology to project during edit
  const addTechnologyToProject = (projectId: string, tech: string) => {
    const project = projectsList.find(p => p.id === projectId);
    if (project && tech.trim() && !project.technologies.includes(tech.trim())) {
      const newTechs = [...project.technologies, tech.trim()];
      handleProjectChange(projectId, 'technologies', newTechs);
      toast.success('Technology added');
    }
  };

  if (isLoading && !projects) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border border-emerald-500/30 p-8 mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-xl border border-emerald-500/20">
                  <FolderOpen className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
                  <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-800/20 to-gray-700/10 backdrop-blur-sm rounded-lg p-3 border border-gray-600/20">
                  <div className="text-2xl font-bold text-emerald-900 mb-1">
                    {projectsList.length}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    Total Projects
                  </span>
                </div>
                <button
                  onClick={() => setIsAddingProject(!isAddingProject)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center"
                >
                  {isAddingProject ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Project
                    </>
                  )}
                </button>
                <button
                  onClick={saveAllProjects}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save All
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {projectsList.filter(p => p.featured).length}
                </div>
                <div className="text-sm text-gray-600">Featured Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {projectsList.filter(p => p.isPublished).length}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {projectsList.reduce((acc, project) => acc + project.technologies.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Technologies Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {projectsList.reduce((acc, project) => acc + project.tags.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Tags</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Project Form */}
        {isAddingProject && (
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50 mb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-xl border border-emerald-500/20">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleNewProjectChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={newProject.description}
                    onChange={handleNewProjectChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                    placeholder="Brief project description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    name="detailedDescription"
                    value={newProject.detailedDescription}
                    onChange={handleNewProjectChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                    placeholder="Detailed project information..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newProject.category}
                      onChange={handleNewProjectChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                    >
                      <option value="">Select category</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile App</option>
                      <option value="design">UI/UX Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={newProject.year}
                      onChange={handleNewProjectChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Client
                    </label>
                    <input
                      type="text"
                      name="client"
                      value={newProject.client}
                      onChange={handleNewProjectChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                      placeholder="Client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Your Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={newProject.role}
                      onChange={handleNewProjectChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* URLs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={newProject.liveUrl}
                      onChange={handleNewProjectChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                      placeholder="https://project.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={newProject.githubUrl}
                      onChange={handleNewProjectChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Add tag"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProject.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-800 text-sm">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1.5 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Technologies
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Add technology"
                    />
                    <button
                      onClick={addTechnology}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProject.technologies.map((tech, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-800 text-sm">
                        <Code className="w-3 h-3 mr-1" />
                        {tech}
                        <button
                          onClick={() => removeTechnology(tech)}
                          className="ml-1.5 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Project Images
                  </label>
                  <input
                    type="file"
                    id="project-images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="project-images" className="cursor-pointer">
                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all mb-4">
                      <Upload className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="text-gray-700 font-medium">Upload Images</span>
                    </div>
                  </label>
                  {projectImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {projectImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={newProject.featured}
                      onChange={handleNewProjectChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-800">
                      Mark as Featured Project
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublished"
                      name="isPublished"
                      checked={newProject.isPublished}
                      onChange={handleNewProjectChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 text-sm font-medium text-gray-800">
                      Publish Immediately
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={createProjectHandler}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-6">
          {projectsList.map((project) => (
            <div key={project.id} className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${project.featured ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/20' : 'bg-gradient-to-r from-gray-500/20 to-gray-500/10 border-gray-500/20'}`}>
                    {project.featured ? (
                      <Star className="w-6 h-6 text-amber-600" />
                    ) : (
                      <FolderOpen className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {editingProjectId === project.id ? (
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                          />
                        ) : (
                          project.title
                        )}
                      </h2>
                      {project.featured && (
                        <span className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-800 text-xs font-bold rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">{project.category}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{project.year}</span>
                      <div className={`flex items-center gap-1 ${project.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                        {project.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span className="text-xs">Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span className="text-xs">Draft</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleProjectExpansion(project.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedProjects[project.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => togglePublish(project.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                      project.isPublished 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 text-yellow-800 hover:from-yellow-500/30' 
                      : 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-800 hover:from-green-500/30'
                    }`}
                  >
                    {project.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  {editingProjectId === project.id ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingProjectId(null);
                          // Clear any pending images for this project
                          setNewImagesForEdit(prev => {
                            const updated = { ...prev };
                            delete updated[project.id];
                            return updated;
                          });
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all font-medium"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateProjectHandler(project.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingProjectId(project.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProjectHandler(project.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Project Details - Always visible */}
              <div className="mb-4">
                <p className="text-gray-700">
                  {editingProjectId === project.id ? (
                    <textarea
                      value={project.description}
                      onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      rows={2}
                    />
                  ) : (
                    project.description
                  )}
                </p>
                
                {/* URLs */}
                <div className="flex items-center gap-4 mt-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="w-3 h-3" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900"
                    >
                      <Code className="w-3 h-3" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Tags and Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {editingProjectId === project.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add tag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTagToProject(project.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg"
                      />
                      <span className="text-xs text-gray-500">Press Enter to add</span>
                    </div>
                  ) : null}
                  {project.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
                      {tag}
                      {editingProjectId === project.id && (
                        <button
                          onClick={() => handleProjectChange(project.id, 'tags', project.tags.filter(t => t !== tag))}
                          className="ml-1.5 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {editingProjectId === project.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add technology"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTechnologyToProject(project.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg"
                      />
                      <span className="text-xs text-gray-500">Press Enter to add</span>
                    </div>
                  ) : null}
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200">
                      <Code className="w-3 h-3 mr-1" />
                      {tech}
                      {editingProjectId === project.id && (
                        <button
                          onClick={() => handleProjectChange(project.id, 'technologies', project.technologies.filter(t => t !== tech))}
                          className="ml-1.5 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedProjects[project.id] && (
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Details */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Project Details
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Detailed Description
                          </label>
                          {editingProjectId === project.id ? (
                            <textarea
                              value={project.detailedDescription}
                              onChange={(e) => handleProjectChange(project.id, 'detailedDescription', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              rows={4}
                            />
                          ) : (
                            <p className="text-gray-700 text-sm">{project.detailedDescription || 'No detailed description provided.'}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Category
                            </label>
                            {editingProjectId === project.id ? (
                              <select
                                value={project.category}
                                onChange={(e) => handleProjectChange(project.id, 'category', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="web">Web Development</option>
                                <option value="mobile">Mobile App</option>
                                <option value="design">UI/UX Design</option>
                              </select>
                            ) : (
                              <span className="text-sm text-gray-700">{project.category}</span>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Year
                            </label>
                            {editingProjectId === project.id ? (
                              <input
                                type="text"
                                value={project.year}
                                onChange={(e) => handleProjectChange(project.id, 'year', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                              />
                            ) : (
                              <span className="text-sm text-gray-700">{project.year}</span>
                            )}
                          </div>
                        </div>

                        {editingProjectId === project.id && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Client
                              </label>
                              <input
                                type="text"
                                value={project.client || ''}
                                onChange={(e) => handleProjectChange(project.id, 'client', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Your Role
                              </label>
                              <input
                                type="text"
                                value={project.role || ''}
                                onChange={(e) => handleProjectChange(project.id, 'role', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle Column - URLs & Status */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Links & Status
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Live URL
                          </label>
                          {editingProjectId === project.id ? (
                            <input
                              type="url"
                              value={project.liveUrl || ''}
                              onChange={(e) => handleProjectChange(project.id, 'liveUrl', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          ) : project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              {project.liveUrl}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">No live URL</span>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            GitHub URL
                          </label>
                          {editingProjectId === project.id ? (
                            <input
                              type="url"
                              value={project.githubUrl || ''}
                              onChange={(e) => handleProjectChange(project.id, 'githubUrl', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          ) : project.githubUrl ? (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-gray-900 text-sm flex items-center gap-1"
                            >
                              {project.githubUrl}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">No GitHub URL</span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Featured Project</span>
                            {editingProjectId === project.id ? (
                              <input
                                type="checkbox"
                                checked={project.featured}
                                onChange={(e) => handleProjectChange(project.id, 'featured', e.target.checked)}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                              />
                            ) : (
                              <span className={`px-2 py-1 text-xs rounded ${project.featured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                                {project.featured ? 'Yes' : 'No'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Published Status</span>
                            {editingProjectId === project.id ? (
                              <input
                                type="checkbox"
                                checked={project.isPublished}
                                onChange={(e) => handleProjectChange(project.id, 'isPublished', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                            ) : (
                              <span className={`px-2 py-1 text-xs rounded ${project.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {project.isPublished ? 'Published' : 'Draft'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Images */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Project Images ({project.images.length + (newImagesForEdit[project.id]?.length || 0)})
                        </h3>
                        {editingProjectId === project.id && (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleAddImagesToProject(project.id, e)}
                              className="hidden"
                            />
                            <span className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all">
                              Add Images
                            </span>
                          </label>
                        )}
                      </div>

                      {(project.images.length > 0 || newImagesForEdit[project.id]?.length > 0) ? (
                        <div className="grid grid-cols-2 gap-3">
                          {/* Show existing images */}
                          {project.images.map((image, index) => (
                            <div key={`existing-${index}`} className="relative group">
                              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={image}
                                  alt={`Project screenshot ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {editingProjectId === project.id && (
                                <button
                                  onClick={() => removeImageFromProject(project.id, index)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs">Existing Screenshot {index + 1}</p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Show preview of new images */}
                          {newImagesForEdit[project.id]?.map((file, index) => (
                            <div key={`new-${index}`} className="relative group">
                              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`New image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {editingProjectId === project.id && (
                                <button
                                  onClick={() => {
                                    // Remove from new images preview
                                    setNewImagesForEdit(prev => ({
                                      ...prev,
                                      [project.id]: prev[project.id].filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600/60 to-transparent p-2">
                                <p className="text-white text-xs font-medium">New Image (Will be added on save)</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl">
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">No images uploaded</p>
                          {editingProjectId === project.id && (
                            <p className="text-xs text-gray-400 mt-1">Add images using the button above</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projectsList.length === 0 && !isAddingProject && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 rounded-2xl border border-emerald-500/20 mb-6">
              <FolderOpen className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first project to showcase your work</p>
            <button
              onClick={() => setIsAddingProject(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManagement;