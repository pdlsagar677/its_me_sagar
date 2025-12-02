"use client";

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Code,
  Globe,
  Calendar,
  Users,
  Star,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  GitBranch,
  Database,
  Server,
  Smartphone,
  Cloud,
  Eye,
  Download
} from 'lucide-react';

type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'on-hold';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  progress: number;
  startDate: string;
  endDate?: string;
  teamSize: number;
  isFeatured: boolean;
  views: number;
  downloads: number;
}

export default function ProjectsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include cart, checkout, payment integration, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'Redux'],
      status: 'completed',
      githubUrl: 'https://github.com/sagar/ecommerce',
      liveUrl: 'https://demo-ecommerce.sagar.com',
      progress: 100,
      startDate: 'Jan 2024',
      endDate: 'Mar 2024',
      teamSize: 3,
      isFeatured: true,
      views: 1250,
      downloads: 89
    },
    {
      id: 2,
      title: 'Portfolio Website',
      description: 'Personal portfolio with blog CMS built using Next.js 14, TypeScript, and Tailwind CSS. Includes dark mode and responsive design.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind', 'MongoDB', 'NextAuth'],
      status: 'completed',
      githubUrl: 'https://github.com/sagar/portfolio',
      liveUrl: 'https://sagar.com',
      progress: 100,
      startDate: 'Dec 2023',
      endDate: 'Jan 2024',
      teamSize: 1,
      isFeatured: true,
      views: 4580,
      downloads: 320
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'Real-time collaborative task management application with drag-drop interface and team collaboration features.',
      technologies: ['React', 'Firebase', 'Socket.io', 'Material-UI', 'DnD'],
      status: 'in-progress',
      githubUrl: 'https://github.com/sagar/taskapp',
      progress: 75,
      startDate: 'Feb 2024',
      teamSize: 2,
      isFeatured: false,
      views: 620,
      downloads: 45
    },
    {
      id: 4,
      title: 'AI Content Generator',
      description: 'AI-powered content creation tool using OpenAI API for blog posts, social media content, and marketing copy.',
      technologies: ['Python', 'FastAPI', 'React', 'OpenAI', 'PostgreSQL'],
      status: 'in-progress',
      githubUrl: 'https://github.com/sagar/ai-generator',
      progress: 40,
      startDate: 'Mar 2024',
      teamSize: 4,
      isFeatured: false,
      views: 890,
      downloads: 67
    },
    {
      id: 5,
      title: 'Mobile Banking App',
      description: 'Cross-platform mobile banking application with biometric authentication and real-time notifications.',
      technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Firebase', 'Biometrics'],
      status: 'planned',
      progress: 10,
      startDate: 'Apr 2024',
      teamSize: 5,
      isFeatured: false,
      views: 210,
      downloads: 12
    },
    {
      id: 6,
      title: 'Cloud Storage Service',
      description: 'Secure cloud storage service with file encryption, sharing, and collaboration features.',
      technologies: ['AWS', 'React', 'Node.js', 'Redis', 'PostgreSQL', 'S3'],
      status: 'on-hold',
      progress: 25,
      startDate: 'Nov 2023',
      teamSize: 3,
      isFeatured: false,
      views: 350,
      downloads: 23
    }
  ]);

  const statusFilters = [
    { id: 'all', label: 'All Projects', count: projects.length, color: 'bg-gray-500' },
    { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length, color: 'bg-green-500' },
    { id: 'in-progress', label: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length, color: 'bg-blue-500' },
    { id: 'planned', label: 'Planned', count: projects.filter(p => p.status === 'planned').length, color: 'bg-yellow-500' },
    { id: 'on-hold', label: 'On Hold', count: projects.filter(p => p.status === 'on-hold').length, color: 'bg-red-500' },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDeleteProject = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(project => project.id !== id));
    }
  };

  const handleToggleFeatured = (id: number) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, isFeatured: !project.isFeatured } : project
    ));
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-900/30 text-green-400';
      case 'in-progress': return 'bg-blue-900/30 text-blue-400';
      case 'planned': return 'bg-yellow-900/30 text-yellow-400';
      case 'on-hold': return 'bg-red-900/30 text-red-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500';
    if (progress >= 50) return 'from-blue-500 to-cyan-500';
    if (progress >= 30) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-2">Manage your portfolio projects and showcase your work</p>
        </div>
        <button className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Add New Project
        </button>
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
              <span className="text-sm font-medium text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                +{Math.floor(Math.random() * 10)}%
              </span>
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
          <div key={project.id} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all group">
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  {project.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-900/30 to-amber-900/30 text-orange-300 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleFeatured(project.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    project.isFeatured 
                      ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/20' 
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-600/30'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600/30 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm font-medium text-white">{project.progress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{project.startDate}{project.endDate && ` - ${project.endDate}`}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                <span>{project.teamSize} member{project.teamSize > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Eye className="w-4 h-4 mr-2" />
                <span>{project.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Download className="w-4 h-4 mr-2" />
                <span>{project.downloads} downloads</span>
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
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
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
        ))}
      </div>

      {/* Tech Stack Overview */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6">Tech Stack Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Code, label: 'Frontend', techs: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
            { icon: Server, label: 'Backend', techs: ['Node.js', 'Express', 'Python', 'FastAPI'] },
            { icon: Database, label: 'Database', techs: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase'] },
            { icon: Cloud, label: 'Cloud', techs: ['AWS', 'Vercel', 'Docker', 'CI/CD'] },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-gray-700/30 rounded-xl">
              <item.icon className="w-6 h-6 text-orange-400 mb-3" />
              <h4 className="font-bold text-white mb-2">{item.label}</h4>
              <div className="space-y-1">
                {item.techs.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}