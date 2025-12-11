"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Globe, 
  FileText, 
  Download, 
  Calendar,
  Award,
  GraduationCap,
  Code,
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink as LinkIcon,
  Star,
  CheckCircle,
  Users,
  FolderOpen,
  Sparkles,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  Shield,
  Layers,
  Cpu,
  Rocket,
  Globe as GlobeIcon,
  RefreshCw,
  Heart
} from 'lucide-react';

interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  cvUrl: string;
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
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/profile');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      
      if (data.success && data.profile) {
        setProfile(data.profile);
      } else {
        throw new Error('Profile not found');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-pulse">
          {/* Cover skeleton */}
          <div className="h-64 bg-gradient-to-r from-gray-800 to-gray-900"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
            {/* Profile header skeleton */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full bg-gray-800 mb-6"></div>
                    <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2 mb-6"></div>
                    <div className="h-12 bg-gray-800 rounded w-full mb-4"></div>
                  </div>
                </div>
              </div>
              <div className="lg:w-2/3">
                <div className="h-96 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 inline-block mb-6">
            <User className="w-16 h-16 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Profile Not Available</h2>
          <p className="text-gray-400 mb-6">
            {error || 'The profile is currently not published or under maintenance.'}
          </p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-500 hover:to-amber-500 transition-all flex items-center justify-center mx-auto font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Enhanced social icons with better visibility
  const socialIcons = {
    linkedin: <Linkedin className="w-5 h-5 text-[#0077B5]" />,
    github: <Github className="w-5 h-5 text-white" />,
    twitter: <Twitter className="w-5 h-5 text-[#1DA1F2]" />,
    facebook: <Facebook className="w-5 h-5 text-[#1877F2]" />,
    instagram: <Instagram className="w-5 h-5 text-[#E4405F]" />,
    youtube: <Youtube className="w-5 h-5 text-[#FF0000]" />,
    website: <GlobeIcon className="w-5 h-5 text-emerald-400" />,
    dribbble: <Sparkles className="w-5 h-5 text-pink-500" />,
    behance: <Layers className="w-5 h-5 text-blue-400" />,
    medium: <BookOpen className="w-5 h-5 text-green-400" />,
    stackoverflow: <Cpu className="w-5 h-5 text-orange-500" />
  };

  const socialPlatforms = {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    twitter: 'Twitter',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    website: 'Website',
    dribbble: 'Dribbble',
    behance: 'Behance',
    medium: 'Medium',
    stackoverflow: 'Stack Overflow'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Cover Section */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5 animate-pulse"></div>
        
        {/* Profile Picture Overlay - Centered and prominent */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            
            <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group-hover:border-orange-500/50 transition-all duration-300">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.fullName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </div>
            
            {/* Availability Badge */}
            {profile.availability && (
              <div className="absolute bottom-4 right-4 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full border-3 border-gray-900 flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:w-1/3">
            {/* Main Profile Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-gray-700/50 hover:border-orange-500/30 transition-all">
              <div className="text-center mt-12">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {profile.fullName}
                </h1>
                <p className="text-orange-300 font-semibold text-lg mb-4">{profile.title}</p>
                <p className="text-gray-300 mb-8">{profile.description}</p>
                
                {/* Availability Badge */}
                {profile.availability && (
                  <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 text-green-400 mb-8">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    Available for opportunities
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  {profile.location && (
                    <div className="flex items-center justify-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-3 text-orange-400" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center justify-center text-gray-300">
                      <Mail className="w-5 h-5 mr-3 text-orange-400" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center justify-center text-gray-300">
                      <Phone className="w-5 h-5 mr-3 text-orange-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.contactEmail && (
                    <div className="flex items-center justify-center text-orange-300 font-medium">
                      <Mail className="w-5 h-5 mr-3" />
                      <span>{profile.contactEmail}</span>
                    </div>
                  )}
                </div>

             
{/* CV Preview/Download Buttons */}
{profile.cvUrl && (
  <div className="space-y-3 mb-8">
    {/* View CV Button - Opens in browser using same route with action=cv */}
    <a
      href="/api/profile?action=cv"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl transition-all flex items-center justify-center font-medium group"
    >
      <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
      View CV/Resume
    </a>
    
    {/* Download CV Button - Forces download using same route */}
    <a
      href="/api/profile?action=cv&download=true"
      className="w-full px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all flex items-center justify-center font-medium group border border-gray-600"
    >
      <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
      Download CV
    </a>
  </div>
)}

                {/* Social Links - Improved visibility */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center">CONNECT WITH ME</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(profile.socialLinks)
                      .filter(([_, url]) => url)
                      .slice(0, 8)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-gray-700 hover:to-gray-800 rounded-xl border border-gray-700/50 hover:border-orange-500/50 transition-all group flex flex-col items-center justify-center"
                          title={socialPlatforms[platform as keyof typeof socialPlatforms]}
                        >
                          <div className="mb-1">
                            {socialIcons[platform as keyof typeof socialIcons] || <Globe className="w-5 h-5 text-gray-400" />}
                          </div>
                          <span className="text-xs text-gray-400 group-hover:text-white">
                            {platform.slice(0, 4)}
                          </span>
                        </a>
                      ))}
                  </div>
                  {Object.entries(profile.socialLinks).filter(([_, url]) => url).length > 8 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {Object.entries(profile.socialLinks)
                        .filter(([_, url]) => url)
                        .slice(8)
                        .map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-gray-700 hover:to-gray-800 rounded-xl border border-gray-700/50 hover:border-orange-500/50 transition-all group flex flex-col items-center justify-center"
                            title={socialPlatforms[platform as keyof typeof socialPlatforms]}
                          >
                            <div className="mb-1">
                              {socialIcons[platform as keyof typeof socialIcons] || <Globe className="w-5 h-5 text-gray-400" />}
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-white">
                              {platform.slice(0, 4)}
                            </span>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700/50 hover:border-orange-500/30 transition-all">
              <h3 className="text-lg font-bold mb-6 flex items-center text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-400" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700/50">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-3 text-orange-400" />
                    <span className="text-gray-300">Experience</span>
                  </div>
                  <span className="font-bold text-white">{profile.experience.years}+ years</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700/50">
                  <div className="flex items-center">
                    <FolderOpen className="w-4 h-4 mr-3 text-orange-400" />
                    <span className="text-gray-300">Projects</span>
                  </div>
                  <span className="font-bold text-white">{profile.experience.projectsCompleted}+ completed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700/50">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-orange-400" />
                    <span className="text-gray-300">Clients</span>
                  </div>
                  <span className="font-bold text-white">{profile.experience.clientsCount}+ happy clients</span>
                </div>
              </div>
            </div>

            {/* Top Skills Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all">
              <h3 className="text-lg font-bold mb-6 flex items-center text-white">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Top Skills
              </h3>
              <div className="space-y-4">
                {profile.skills.slice(0, 5).map((skillCategory, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                        {skillCategory.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        skillCategory.level === 'expert' ? 'bg-purple-500/20 text-purple-300' :
                        skillCategory.level === 'advanced' ? 'bg-blue-500/20 text-blue-300' :
                        skillCategory.level === 'intermediate' ? 'bg-green-500/20 text-green-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {skillCategory.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          skillCategory.level === 'expert' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                          skillCategory.level === 'advanced' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          skillCategory.level === 'intermediate' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          'bg-gradient-to-r from-yellow-500 to-yellow-600'
                        }`}
                        style={{
                          width: skillCategory.level === 'expert' ? '100%' :
                                 skillCategory.level === 'advanced' ? '85%' :
                                 skillCategory.level === 'intermediate' ? '70%' : '50%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:w-2/3">
            {/* About Section Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-gray-700/50 hover:border-orange-500/30 transition-all">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-xl border border-orange-500/20 mr-4">
                  <User className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">About Me</h2>
              </div>
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700/50">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {profile.bio}
                </p>
              </div>
            </div>

            {/* Experience Section Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-gray-700/50 hover:border-orange-500/30 transition-all">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-xl border border-orange-500/20 mr-4">
                  <Briefcase className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Work Experience</h2>
              </div>
              
              <div className="mb-8">
                {/* Experience Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/50 hover:border-orange-500/30 transition-all">
                    <div className="flex items-center mb-3">
                      <Calendar className="w-6 h-6 text-orange-400 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-white">{profile.experience.years} Years</div>
                        <div className="text-sm text-gray-400">Professional Experience</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/50 hover:border-orange-500/30 transition-all">
                    <div className="flex items-center mb-3">
                      <FolderOpen className="w-6 h-6 text-emerald-400 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-white">{profile.experience.projectsCompleted} Projects</div>
                        <div className="text-sm text-gray-400">Successfully Delivered</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Experience Timeline */}
                <div className="space-y-6">
                  {profile.experience.companies.map((company, idx) => (
                    <div 
                      key={idx}
                      className="relative pl-10 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-orange-500 before:via-amber-500 before:to-transparent"
                    >
                      <div className="absolute left-[-4px] top-6 w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 border-2 border-gray-900"></div>
                      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/50 p-6 ml-4 hover:border-orange-500/30 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white mb-2 md:mb-0">{company.name}</h3>
                          <span className="text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
                            {company.duration}
                          </span>
                        </div>
                        <p className="text-orange-300 font-medium text-lg mb-4">{company.position}</p>
                        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/20 rounded-lg p-4 border border-gray-700/50">
                          <p className="text-gray-300">{company.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills & Technologies Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-gray-700/50 hover:border-orange-500/30 transition-all">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-xl border border-orange-500/20 mr-4">
                  <Code className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Skills & Technologies</h2>
              </div>
              
              {/* Skills by Category */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-orange-400" />
                  Skill Categories
                </h3>
                <div className="space-y-6">
                  {profile.skills.map((skillCategory, idx) => (
                    <div 
                      key={idx}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                        <h4 className="font-bold text-white text-lg mb-2 md:mb-0">{skillCategory.category}</h4>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          skillCategory.level === 'expert' ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-300 border border-purple-500/30' :
                          skillCategory.level === 'advanced' ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 border border-blue-500/30' :
                          skillCategory.level === 'intermediate' ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-300 border border-green-500/30' :
                          'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {skillCategory.level}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {skillCategory.items.map((item, itemIdx) => (
                          <span 
                            key={itemIdx}
                            className="px-4 py-2.5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 text-gray-300 rounded-xl text-sm font-medium hover:border-orange-500/50 hover:text-white transition-all flex items-center group"
                          >
                            <Code className="w-4 h-4 mr-2 text-orange-400 group-hover:animate-pulse" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Cpu className="w-5 h-5 mr-2 text-orange-400" />
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.technologies.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-5 py-2.5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 text-white rounded-xl font-medium flex items-center group hover:border-orange-500/50 hover:bg-gradient-to-r hover:from-orange-600/20 hover:to-amber-600/10 transition-all"
                    >
                      <Rocket className="w-4 h-4 mr-2 text-orange-400 group-hover:rotate-45 transition-transform" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Education & Certifications Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Education Card */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700/50 hover:border-orange-500/30 transition-all">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-xl border border-purple-500/20 mr-4">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Education</h2>
                </div>
                <div className="space-y-6">
                  {profile.education.map((edu, idx) => (
                    <div 
                      key={idx}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/50 p-6 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-start mb-4">
                        <GraduationCap className="w-6 h-6 text-purple-400 mr-3 mt-1" />
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2">{edu.degree}</h3>
                          <p className="text-purple-300 font-medium mb-3">{edu.institution}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {edu.year}
                      </div>
                      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/20 rounded-lg p-4 border border-gray-700/50">
                        <p className="text-gray-300">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Card */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700/50 hover:border-orange-500/30 transition-all">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/10 rounded-xl border border-yellow-500/20 mr-4">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Certifications</h2>
                </div>
                <div className="space-y-6">
                  {profile.certifications.map((cert, idx) => (
                    <div 
                      key={idx}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700/50 p-6 hover:border-yellow-500/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start">
                          <Award className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                            <p className="text-yellow-300 font-medium text-sm mb-3">{cert.issuer}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm bg-gray-800/50 px-3 py-1.5 rounded-full">
                          <Calendar className="w-3 h-3 mr-1" />
                          {cert.year}
                        </div>
                      </div>
                      {cert.url && (
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 text-blue-400 hover:text-white hover:border-blue-500/50 rounded-lg font-medium text-sm transition-all group"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Verify Certificate
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;