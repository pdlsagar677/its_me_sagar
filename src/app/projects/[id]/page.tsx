"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Users,
  Code,
  Globe,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderKanban,
  Tag,
  Layers,
  GitBranch,
  Rocket,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Award,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Server,
  Terminal
} from 'lucide-react';

// Define Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  githubUrl?: string;
  projectUrl?: string;
  coverImage?: string;
  screenshots?: string[];
  isFeatured: boolean;
  status: 'completed' | 'in-progress' | 'planned' | 'on-hold';
  complexity: string;
  featuredTechnologies?: string[];
  projectDate: Date;
  client?: string;
  role?: string;
  duration?: string;
  tags?: string[];
}

const ProjectDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  // State
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to load project');
        }
        
        const data = await response.json();
        
        if (data.success && data.project) {
          // Transform date string to Date object
          const projectData = {
            ...data.project,
            projectDate: new Date(data.project.projectDate),
          };
          setProject(projectData);
        } else {
          throw new Error('Invalid project data');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-gradient-to-r from-green-500 to-emerald-500',
          text: 'text-green-600',
          bg: 'bg-green-500/10',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'in-progress':
        return {
          color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          text: 'text-blue-600',
          bg: 'bg-blue-500/10',
          icon: Clock,
          label: 'In Progress'
        };
      case 'planned':
        return {
          color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
          text: 'text-yellow-600',
          bg: 'bg-yellow-500/10',
          icon: AlertCircle,
          label: 'Planned'
        };
      case 'on-hold':
        return {
          color: 'bg-gradient-to-r from-red-500 to-pink-500',
          text: 'text-red-600',
          bg: 'bg-red-500/10',
          icon: AlertCircle,
          label: 'On Hold'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-500',
          text: 'text-gray-600',
          bg: 'bg-gray-500/10',
          icon: FolderKanban,
          label: 'Unknown'
        };
    }
  };

  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'beginner': return 'from-green-500/20 to-emerald-500/10 text-green-600';
      case 'intermediate': return 'from-blue-500/20 to-cyan-500/10 text-blue-600';
      case 'advanced': return 'from-purple-500/20 to-pink-500/10 text-purple-600';
      case 'expert': return 'from-red-500/20 to-orange-500/10 text-red-600';
      default: return 'from-gray-500/20 to-gray-500/10 text-gray-600';
    }
  };

  // Get technology icon
  const getTechIcon = (tech: string) => {
    const techLower = tech.toLowerCase();
    if (techLower.includes('react') || techLower.includes('vue') || techLower.includes('angular')) {
      return Cpu;
    } else if (techLower.includes('node') || techLower.includes('express') || techLower.includes('nest')) {
      return Server;
    } else if (techLower.includes('mongo') || techLower.includes('sql') || techLower.includes('postgres')) {
      return Database;
    } else if (techLower.includes('docker') || techLower.includes('kubernetes') || techLower.includes('aws')) {
      return Shield;
    } else {
      return Terminal;
    }
  };

  // Navigation between images
  const nextImage = () => {
    if (project?.screenshots) {
      setActiveImageIndex((prev) => 
        prev === project.screenshots!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.screenshots) {
      setActiveImageIndex((prev) => 
        prev === 0 ? project.screenshots!.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-2xl border border-red-500/20 mb-6 inline-flex">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Project Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/projects')}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const statusInfo = getStatusInfo(project.status);
  const StatusIcon = statusInfo.icon;
  const allImages = [project.coverImage, ...(project.screenshots || [])].filter(Boolean);
  const activeImage = allImages[activeImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/projects')}
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-gray-300 rounded-xl transition-all border border-gray-700/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-amber-600/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-8 pt-20">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
                    <StatusIcon className={`w-5 h-5 ${statusInfo.text}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                  </span>
                  {project.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {project.title}
                </h1>
                
                <p className="text-xl text-gray-300 mb-6">
                  {project.shortDescription || project.description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{project.projectDate.getFullYear()}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getComplexityColor(project.complexity)}`}>
                      {project.complexity}
                    </span>
                  </div>
                  {project.client && (
                    <div className="flex items-center text-gray-400">
                      <Award className="w-5 h-5 mr-2 text-purple-500" />
                      <span>{project.client}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-white rounded-xl transition-colors"
                  >
                    <GitBranch className="w-5 h-5 mr-2" />
                    View Code
                  </a>
                )}
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl transition-all"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Live Demo
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Images */}
              {allImages.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-orange-500" />
                      Project Screenshots
                    </h2>
                    <span className="text-sm text-gray-400">
                      {activeImageIndex + 1} of {allImages.length}
                    </span>
                  </div>
                  
                  {/* Main Image */}
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <img
                      src={activeImage}
                      alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                      className="w-full h-auto max-h-[500px] object-cover cursor-pointer"
                      onClick={() => setIsImageModalOpen(true)}
                    />
                    
                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-white hover:bg-gray-800/80 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-white hover:bg-gray-800/80 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImageIndex === index
                              ? 'border-orange-500 scale-105'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Project Description */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-4">About This Project</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-8">
              {/* Technologies */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-orange-500" />
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => {
                    const TechIcon = getTechIcon(tech);
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-2 bg-gray-700/50 text-gray-300 rounded-xl border border-gray-600/50"
                      >
                        <TechIcon className="w-4 h-4 mr-2 text-orange-500" />
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FolderKanban className="w-5 h-5 mr-2 text-orange-500" />
                  Project Details
                </h2>
                
                <div className="space-y-4">
                  {project.role && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">My Role</h3>
                      <p className="text-gray-300">{project.role}</p>
                    </div>
                  )}
                  
                  {project.duration && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Duration</h3>
                      <p className="text-gray-300">{project.duration}</p>
                    </div>
                  )}
                  
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Tag className="w-4 h-4 mr-1" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-700/50 text-gray-400 rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-orange-500" />
                  Project Links
                </h2>
                
                <div className="space-y-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-700/30 hover:bg-gray-600/30 border border-gray-600/50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center">
                        <GitBranch className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <div className="text-gray-300">GitHub Repository</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {new URL(project.githubUrl).hostname}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
                    </a>
                  )}
                  
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-600/10 to-amber-600/5 hover:from-orange-600/20 hover:to-amber-600/10 border border-orange-500/20 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3 text-orange-500" />
                        <div>
                          <div className="text-gray-300">Live Demo</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {new URL(project.projectUrl).hostname}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-orange-500" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">More Projects</h2>
              <Link
                href="/projects"
                className="text-orange-500 hover:text-orange-400 flex items-center"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This would be populated with related projects */}
              <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-2">Explore More</h3>
                <p className="text-gray-400 mb-4">
                  Check out other projects in my portfolio
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center text-orange-500 hover:text-orange-400"
                >
                  Browse Projects
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && activeImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <img
              src={activeImage}
              alt="Full size preview"
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-white hover:bg-gray-800/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProjectDetailsPage;