"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  FileText,
  FolderKanban,
  User,
  Calendar,
  Plus,
  ExternalLink,
  Eye,
  ThumbsUp,
  Home,
  Sparkles,
  Settings,
  Users,
  BarChart,
  Edit,
  Trash2,
  Globe,
  Code,
  Database,
  Server,
  Smartphone,
  Cloud,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 12,
    totalProjects: 8,
    totalViews: 4580,
    totalLikes: 320
  });

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');

    // Load mock stats
    setStats({
      totalPosts: 12,
      totalProjects: 8,
      totalViews: 4580,
      totalLikes: 320
    });
  }, []);

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/posts'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'from-green-500 to-emerald-500',
      link: '/admin/projects'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/analytics'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: ThumbsUp,
      color: 'from-orange-500 to-amber-500',
      link: '/admin/analytics'
    }
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Getting Started with Next.js 14',
      excerpt: 'Learn how to build modern web applications with Next.js 14',
      author: 'SAGAR',
      date: 'Jan 15, 2024',
      views: 1250,
      likes: 89,
      status: 'published'
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS',
      excerpt: 'A comprehensive guide to Tailwind CSS utilities',
      author: 'SAGAR',
      date: 'Jan 10, 2024',
      views: 890,
      likes: 45,
      status: 'published'
    },
    {
      id: 3,
      title: 'Building REST APIs with Node.js',
      excerpt: 'Create robust REST APIs using Node.js and Express',
      author: 'SAGAR',
      date: 'Jan 5, 2024',
      views: 620,
      likes: 32,
      status: 'draft'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce with React & Node.js',
      technologies: ['React', 'Node.js', 'MongoDB'],
      status: 'completed'
    },
    {
      id: 2,
      title: 'Portfolio Website',
      description: 'Personal portfolio with blog CMS',
      technologies: ['Next.js', 'TypeScript', 'Tailwind'],
      status: 'completed'
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'Real-time collaborative task management',
      technologies: ['React', 'Firebase', 'Socket.io'],
      status: 'in-progress'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Good {timeOfDay}, <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">{user?.username}</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome to your admin dashboard. Manage your portfolio content here.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white font-medium rounded-xl transition-all duration-300"
        >
          <Home className="w-4 h-4 mr-2" />
          View Portfolio
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}/20`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
              </div>
              <Link 
                href={stat.link}
                className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-400" />
              Recent Posts
            </h2>
            <Link 
              href="/admin/posts"
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center"
            >
              View all
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div 
                key={post.id}
                className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-orange-500/30 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <h3 className="font-medium text-white group-hover:text-orange-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 truncate">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views} views
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {post.likes} likes
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/admin/posts/${post.id}`}
                    className="ml-4 p-2 text-gray-400 hover:text-orange-400 hover:bg-gray-600/30 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FolderKanban className="w-5 h-5 mr-2 text-green-400" />
              Recent Projects
            </h2>
            <Link 
              href="/admin/projects"
              className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center"
            >
              View all
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div 
                key={project.id}
                className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'completed' 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-orange-400" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center p-3 bg-gradient-to-r from-orange-600/10 to-amber-600/5 border border-orange-500/20 rounded-xl text-orange-300 hover:bg-orange-500/20 transition-colors group"
            >
              <Plus className="w-4 h-4 mr-3" />
              <span>New Blog Post</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center p-3 bg-gradient-to-r from-green-600/10 to-emerald-600/5 border border-green-500/20 rounded-xl text-green-300 hover:bg-green-500/20 transition-colors group"
            >
              <FolderKanban className="w-4 h-4 mr-3" />
              <span>Add New Project</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/admin/profile"
              className="flex items-center p-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/5 border border-blue-500/20 rounded-xl text-blue-300 hover:bg-blue-500/20 transition-colors group"
            >
              <User className="w-4 h-4 mr-3" />
              <span>Edit Profile</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Server className="w-5 h-5 mr-2 text-blue-400" />
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database</span>
              <span className="text-green-400 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Server</span>
              <span className="text-green-400 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Storage</span>
              <span className="text-blue-400 font-medium">65% used</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Backup</span>
              <span className="text-gray-400">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-400" />
            Profile Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-xl flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">{user?.username}</h3>
                <p className="text-sm text-gray-400">Administrator</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400">Posts Created</p>
                <p className="text-white font-bold">{stats.totalPosts}</p>
              </div>
              <div className="p-3 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400">Projects</p>
                <p className="text-white font-bold">{stats.totalProjects}</p>
              </div>
            </div>
            <Link
              href="/admin/profile"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-purple-600/10 to-pink-600/5 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 rounded-xl transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}