"use client";

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
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
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'on-hold';

const ProjectsPage = () => {
  const { 
    projects = [],
    fetchAllProjects,
    isLoading 
  } = useAdminStore();

  // State
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load projects
  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // Status filters
  const statusFilters = [
    { id: 'all', label: 'All Projects', count: projects.length, color: 'bg-gray-500', icon: FolderKanban },
    { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length, color: 'bg-green-500', icon: CheckCircle },
    { id: 'in-progress', label: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length, color: 'bg-blue-500', icon: Clock },
    { id: 'planned', label: 'Planned', count: projects.filter(p => p.status === 'planned').length, color: 'bg-yellow-500', icon: AlertCircle },
  ];

  // Filtered projects
  const filteredProjects = projects.filter(project => {
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.shortDescription || project.description).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
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

  // Get project image - FIXED: Use the correct fields from store
  const getProjectImage = (project: any) => {
    // First try coverImage, then first screenshot, then placeholder
    return project.coverImage || 
           (project.screenshots && project.screenshots.length > 0 ? project.screenshots[0] : '/api/placeholder/400/250');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-2">Showcase of my portfolio projects</p>
        </div>
        <Link
          href="/admin/addProjects" // Changed from /admin/addProjects
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Manage Projects
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'from-blue-500 to-cyan-500' },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { label: 'In Progress', value: projects.filter(p => p.status === 'in-progress').length, icon: Clock, color: 'from-yellow-500 to-amber-500' },
          { label: 'Featured', value: projects.filter(p => p.isFeatured).length, icon: Star, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}/20`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
              </div>
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
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Filter by:</span>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedStatus(filter.id as ProjectStatus | 'all')}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/70 transition-all group overflow-hidden">
            {/* Project Image - FIXED: Using getProjectImage function */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={getProjectImage(project)}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
              
              {/* Status and Featured Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status || 'completed')}`}>
                  {(project.status || 'completed').charAt(0).toUpperCase() + (project.status || 'completed').slice(1).replace('-', ' ')}
                </span>
                {project.isFeatured && (
                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-900/50 to-amber-900/30 text-orange-300 rounded-full flex items-center backdrop-blur-sm">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.shortDescription || project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 4).map((tech: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-400 rounded">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {project.projectDate ? new Date(project.projectDate).getFullYear() : new Date().getFullYear()}
                  </span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{project.complexity || 'Intermediate'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white rounded-xl transition-colors text-sm"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </a>
                )}
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/10 hover:from-blue-500/30 hover:to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-xl transition-colors text-sm"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? 'No projects match your search criteria' : 'Get started by adding your first project'}
          </p>
          <Link
            href="/admin/addProjects"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Manage Projects
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;