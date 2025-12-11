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
  CheckCircle,
  Users,
  FolderOpen,
  Sparkles,
  BookOpen,
  Layers,
  Cpu,
  RefreshCw,
  MessageCircle,
  Building,
  Zap,
  Star,
  ArrowUpRight,
  Shield,
  Rocket,
  Target
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="flex flex-col items-center -mt-16">
              <div className="w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-700 border-8 border-white dark:border-gray-950"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg inline-block mb-6">
            <User className="w-16 h-16 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Profile Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The profile is currently not published or under maintenance.'}
          </p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center mx-auto font-medium shadow-md"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const socialIcons = {
    linkedin: <Linkedin className="w-5 h-5 text-[#0077B5]" />,
    github: <Github className="w-5 h-5 text-gray-900 dark:text-gray-300" />,
    twitter: <Twitter className="w-5 h-5 text-[#1DA1F2]" />,
    facebook: <Facebook className="w-5 h-5 text-[#1877F2]" />,
    instagram: <Instagram className="w-5 h-5 text-[#E4405F]" />,
    youtube: <Youtube className="w-5 h-5 text-[#FF0000]" />,
    website: <Globe className="w-5 h-5 text-emerald-500" />,
    dribbble: <Sparkles className="w-5 h-5 text-pink-500" />,
    behance: <Layers className="w-5 h-5 text-blue-400" />,
    medium: <BookOpen className="w-5 h-5 text-green-500" />,
    stackoverflow: <Cpu className="w-5 h-5 text-orange-500" />
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Cover Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          {profile.coverImage && (
            <Image
              src={profile.coverImage}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        
        {/* Profile Picture - COMPLETELY SEPARATE from cover */}
        <div className="relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center -mt-24">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                
                {/* Profile Image Container - Fully visible above everything */}
                <div className="relative w-56 h-56 rounded-full border-8 border-white dark:border-gray-950 bg-white dark:bg-gray-950 overflow-hidden shadow-2xl z-10">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={profile.fullName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                      <User className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Availability Badge */}
                {profile.availability && (
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-4 border-white dark:border-gray-950 flex items-center justify-center shadow-lg z-20 animate-pulse">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Section - BELOW profile picture */}
      <div className="max-w-6xl mx-auto px-4 pt-20">
        {/* Name and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {profile.fullName}
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
            {profile.title}
          </p>
          
          {/* Location & Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {profile.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                <span className="font-medium">{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 mr-2 text-blue-500" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 mr-2 text-blue-500" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href={`mailto:${profile.contactEmail || profile.email}`}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Me
            </a>
            {profile.cvUrl && (
              <>
                <a
                  href="/api/profile?action=cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View CV
                </a>
                <a
                  href="/api/profile?action=cv&download=true"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download CV
                </a>
              </>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-12">
            {Object.entries(profile.socialLinks)
              .filter(([_, url]) => url)
              .map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110 shadow-sm"
                  title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                >
                  {socialIcons[platform as keyof typeof socialIcons] || <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                </a>
              ))}
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 pb-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.experience.years}+</div>
                  <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                  <FolderOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.experience.projectsCompleted}</div>
                  <div className="text-gray-600 dark:text-gray-400">Projects</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.experience.clientsCount}</div>
                  <div className="text-gray-600 dark:text-gray-400">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-500" />
              About Me
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Code className="w-6 h-6 mr-3 text-blue-500" />
              Skills & Expertise
            </h2>
            <div className="space-y-6">
              {profile.skills.map((skillCategory, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{skillCategory.category}</h3>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      skillCategory.level === 'expert' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                      skillCategory.level === 'advanced' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      skillCategory.level === 'intermediate' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {skillCategory.level}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skillCategory.items.map((item, itemIdx) => (
                      <span 
                        key={itemIdx}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Technologies */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {profile.technologies.map((tech, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 rounded-lg font-medium border border-blue-200 dark:border-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Building className="w-6 h-6 mr-3 text-blue-500" />
              Work Experience
            </h2>
            <div className="space-y-8">
              {profile.experience.companies.map((company, idx) => (
                <div key={idx} className="pb-8 border-b border-gray-200 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h3>
                    <span className="text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
                      {company.duration}
                    </span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">{company.position}</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                    <p className="text-gray-700 dark:text-gray-300">{company.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-blue-500" />
                Education
              </h2>
              <div className="space-y-6">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{edu.institution}</p>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {edu.year}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-blue-500" />
                Certifications
              </h2>
              <div className="space-y-6">
                {profile.certifications.map((cert, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                      <span className="text-gray-600 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {cert.year}
                      </span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{cert.issuer}</p>
                    {cert.url && (
                      <a 
                        href={cert.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Verify Certificate
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
  );
};

export default ProfilePage;