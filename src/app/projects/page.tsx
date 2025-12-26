"use client";

import React, { useState, useEffect } from 'react';
import { 
  FolderKanban,
  Plus,
  Code,
  Globe,
  Calendar,
  Users,
  Star,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight,
  Eye,
  Tag,
  Layers,
  GitBranch,
  Rocket,
  Award,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'on-hold';

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
  status: ProjectStatus;
  complexity: string;
  featuredTechnologies?: string[];
  projectDate: Date;
}

const ProjectsPage = () => {
  const router = useRouter();
  
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'featured' | 'year'>('latest');

  // Load projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        // Transform the data to match our Project interface
        const transformedProjects: Project[] = data.projects?.map((project: any) => ({
          id: project._id || project.id,
          title: project.title,
          description: project.description,
          shortDescription: project.shortDescription,
          technologies: project.technologies || [],
          githubUrl: project.githubUrl,
          projectUrl: project.projectUrl,
          coverImage: project.coverImage,
          screenshots: project.screenshots || [],
          isFeatured: project.isFeatured || false,
          status: (project.status || 'completed') as ProjectStatus,
          complexity: project.complexity || 'intermediate',
          featuredTechnologies: project.featuredTechnologies || [],
          projectDate: project.projectDate ? new Date(project.projectDate) : new Date()
        })) || [];
        
        setProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get all unique categories
  const categories = ['all', ...new Set(projects.map(p => p.complexity || '').filter(Boolean))] as string[];

  // Status filters
  const statusFilters = [
    { id: 'all', label: 'All Projects', count: projects.length, color: 'bg-gray-500', icon: FolderKanban },
    { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length, color: 'bg-green-500', icon: CheckCircle },
    { id: 'in-progress', label: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length, color: 'bg-blue-500', icon: Clock },
    { id: 'planned', label: 'Planned', count: projects.filter(p => p.status === 'planned').length, color: 'bg-yellow-500', icon: AlertCircle },
  ];

  // Filtered and sorted projects
  const filteredProjects = projects
    .filter(project => {
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || project.complexity === selectedCategory;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (project.shortDescription || project.description).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.technologies?.some((tech: string) => 
                            tech.toLowerCase().includes(searchQuery.toLowerCase())
                          );
      return matchesStatus && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        case 'year':
          const yearA = a.projectDate ? new Date(a.projectDate).getFullYear() : 0;
          const yearB = b.projectDate ? new Date(b.projectDate).getFullYear() : 0;
          return yearB - yearA;
        case 'latest':
        default:
          return new Date(b.projectDate || 0).getTime() - new Date(a.projectDate || 0).getTime();
      }
    });

  // Get status color
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-900/30 to-emerald-900/20 text-green-400 border border-green-500/20';
      case 'in-progress': return 'bg-gradient-to-r from-blue-900/30 to-cyan-900/20 text-blue-400 border border-blue-500/20';
      case 'planned': return 'bg-gradient-to-r from-yellow-900/30 to-amber-900/20 text-yellow-400 border border-yellow-500/20';
      case 'on-hold': return 'bg-gradient-to-r from-red-900/30 to-pink-900/20 text-red-400 border border-red-500/20';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'beginner': return 'from-green-500/20 to-emerald-500/10 text-green-400';
      case 'intermediate': return 'from-blue-500/20 to-cyan-500/10 text-blue-400';
      case 'advanced': return 'from-purple-500/20 to-pink-500/10 text-purple-400';
      case 'expert': return 'from-red-500/20 to-orange-500/10 text-red-400';
      default: return 'from-gray-500/20 to-gray-500/10 text-gray-400';
    }
  };

  // Get project image
 // Get project image
const getProjectImage = (project: Project) => {
  if (project.coverImage) return project.coverImage;
  if (project.screenshots && project.screenshots.length > 0) return project.screenshots[0];
  
  // Use a real placeholder instead of /api/placeholder
  return `https://placehold.co/400x250/1f2937/ffffff?text=${encodeURIComponent(project.title || 'Project')}`;
};

  // View project details
  const viewProjectDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600/20 to-amber-600/20 backdrop-blur-sm border-b border-orange-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full -translate-x-32 translate-y-32" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-2xl border border-orange-500/20 mb-6">
              <FolderKanban className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Explore my portfolio of creative projects, from web applications to innovative solutions
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[
                { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'from-orange-500 to-amber-500' },
                { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
                { label: 'In Progress', value: projects.filter(p => p.status === 'in-progress').length, icon: Clock, color: 'from-blue-500 to-cyan-500' },
                { label: 'Featured', value: projects.filter(p => p.isFeatured).length, icon: Star, color: 'from-purple-500 to-pink-500' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}/20 mb-3 inline-flex`}>
                    <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects by name, description, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedStatus(filter.id as ProjectStatus | 'all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedStatus === filter.id
                          ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/30'
                          : 'bg-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-600/30 border border-transparent'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${filter.color}`}></div>
                      {filter.label}
                      <span className="px-1.5 py-0.5 text-xs bg-gray-600/50 rounded-full">{filter.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-sm text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="latest">Latest First</option>
                <option value="featured">Featured First</option>
                <option value="year">Year (New to Old)</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6 pt-6 border-t border-gray-600/30">
            <div className="flex items-center gap-3 mb-3">
              <Layers className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Categories:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-blue-300 border border-blue-500/30'
                      : 'bg-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-600/30 border border-transparent'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 hover:border-orange-500/30 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Project Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={getProjectImage(project)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                
                {/* Status and Featured Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${getStatusColor(project.status || 'completed')}`}>
                    {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ') : 'Completed'}
                  </span>
                  {project.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 font-medium rounded-full backdrop-blur-sm flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                {project.complexity && (
                  <span className={`absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm bg-gradient-to-r ${getCategoryColor(project.complexity)}`}>
                    {project.complexity}
                  </span>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                {/* Title and Description */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {project.shortDescription || project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.slice(0, 3).map((tech: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-500 rounded-lg">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Meta Info */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                    <span>
                      {project.projectDate ? new Date(project.projectDate).getFullYear() : new Date().getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{project.complexity || 'Intermediate'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => viewProjectDetails(project.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all group/btn"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex gap-1">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-gray-300 rounded-xl transition-colors"
                        title="View Source Code"
                      >
                        <GitBranch className="w-4 h-4" />
                      </a>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/10 hover:from-blue-500/30 hover:to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-xl transition-colors"
                        title="Live Demo"
                      >
                        <Rocket className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50">
            <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'No projects match your search criteria. Try adjusting your filters.'
                : 'No projects available yet. Check back soon for updates!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-500 hover:to-amber-500 transition-all font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

       
      </div>
    </div>
  );
};



export default ProjectsPage;