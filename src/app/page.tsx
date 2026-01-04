import React from 'react';
import { 
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  FolderOpen,
  Code,
  ArrowRight,
  ChevronRight,
  Star,
  Eye,
  Briefcase
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Define interfaces
interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  githubUrl?: string;
  projectUrl?: string;
  coverImage?: string;
  isFeatured: boolean;
  status: 'completed' | 'in-progress' | 'planned' | 'on-hold';
  complexity: string;
}

interface Profile {
  fullName: string;
  title: string;
  description: string;
  profileImage: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

// This runs at build time (or at request time with revalidate)
async function getHomeData() {
  try {
    console.log('Fetching homepage data at build time...');
    
    // Fetch profile
    const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/profile`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds (ISR)
    });
    
    let profile: Profile | null = null;
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      if (profileData.success) {
        profile = profileData.profile;
      }
    }
    
    // Fetch projects
    const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/projects?limit=3`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds (ISR)
    });
    
    let projects: Project[] = [];
    if (projectsRes.ok) {
      const projectsData = await projectsRes.json();
      if (projectsData.success) {
        projects = projectsData.projects.slice(0, 3);
      }
    }
    
    return {
      profile,
      projects,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      profile: null,
      projects: [],
      timestamp: new Date().toISOString()
    };
  }
}

export default async function HomePage() {
  // This runs on the server at build time or request time
  const { profile, projects, timestamp } = await getHomeData();
  
  // Get project image
  const getProjectImage = (project: Project) => {
    if (project.coverImage) return project.coverImage;
    return `https://placehold.co/400x250/1f2937/ffffff?text=${encodeURIComponent(project.title || 'Project')}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'planned': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'on-hold': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      
      {/* ========== HERO SECTION ========== */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left - About Me */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  {profile?.fullName || 'Full Stack Engineer'}
                </h1>
                <p className="text-2xl text-orange-400 font-semibold mb-4">
                  {profile?.title || 'Building Digital Solutions'}
                </p>
                <p className="text-xl text-gray-400 max-w-2xl">
                  {profile?.description || 'Passionate about creating elegant solutions to complex problems. Transforming ideas into functional, beautiful applications.'}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-300">
                  <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                  <span>Full Stack Development</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Code className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Modern Tech Stack</span>
                </div>
              </div>
            </div>

            {/* Right - Profile Picture */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-full h-full rounded-full border-4 border-gray-700/50 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {profile?.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={profile.fullName || 'Profile'}
                      width={384}
                      height={384}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-7xl font-bold text-gray-600">
                        {(profile?.fullName || 'FS').charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Floating Badges */}
                <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-gradient-to-r from-orange-600/20 to-amber-600/10 backdrop-blur-sm border border-orange-500/30 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-white font-medium">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROJECTS SECTION ========== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                My <span className="text-orange-400">Projects</span>
              </h2>
              <p className="text-gray-400">A showcase of my recent work and contributions</p>
            </div>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-orange-600/20 hover:to-amber-600/10 border border-gray-700/50 hover:border-orange-500/30 text-gray-300 hover:text-white rounded-xl transition-all flex items-center font-medium group"
            >
              <span>View All Projects</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project: Project) => ( // Added type annotation here
                <div 
                  key={project.id}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Project Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={getProjectImage(project)}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                    
                    {/* Status Badge */}
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status || 'completed')}`}>
                      {project.status?.charAt(0).toUpperCase() + project.status?.slice(1).replace('-', ' ') || 'Completed'}
                    </span>
                    
                    {project.isFeatured && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/20">
                        <Star className="w-3 h-3 inline mr-1" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.shortDescription || project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 4).map((tech: string, index: number) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link 
                      href={`/projects/${project.id}`}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-orange-600/20 hover:to-amber-600/10 border border-gray-700/50 hover:border-orange-500/30 text-gray-300 hover:text-white rounded-xl transition-all text-center group/btn"
                    >
                      <div className="flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
                <p className="text-gray-400">Projects will appear here once added</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get In <span className="text-orange-400">Touch</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Feel free to reach out for collaborations, opportunities, or just to say hello!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                    
                    <div className="space-y-6">
                      {profile?.email && (
                        <div className="flex items-center">
                          <div className="p-3 bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-xl border border-orange-500/20 mr-4">
                            <Mail className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Email</div>
                            <div className="text-lg font-medium text-white">{profile.email}</div>
                          </div>
                        </div>
                      )}

                      {profile?.phone && (
                        <div className="flex items-center">
                          <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 rounded-xl border border-blue-500/20 mr-4">
                            <Phone className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Phone</div>
                            <div className="text-lg font-medium text-white">{profile.phone}</div>
                          </div>
                        </div>
                      )}

                      {profile?.location && (
                        <div className="flex items-center">
                          <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/10 rounded-xl border border-green-500/20 mr-4">
                            <MapPin className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Location</div>
                            <div className="text-lg font-medium text-white">{profile.location}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Connect With Me</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {profile?.socialLinks?.github && (
                        <a
                          href={profile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/30 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 hover:border-white/50 rounded-xl transition-all group"
                        >
                          <div className="flex flex-col items-center">
                            <Github className="w-8 h-8 text-gray-300 group-hover:text-white mb-2" />
                            <span className="text-sm text-gray-400 group-hover:text-white">GitHub</span>
                          </div>
                        </a>
                      )}

                      {profile?.socialLinks?.linkedin && (
                        <a
                          href={profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/30 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 hover:border-blue-500/50 rounded-xl transition-all group"
                        >
                          <div className="flex flex-col items-center">
                            <Linkedin className="w-8 h-8 text-gray-300 group-hover:text-blue-400 mb-2" />
                            <span className="text-sm text-gray-400 group-hover:text-blue-400">LinkedIn</span>
                          </div>
                        </a>
                      )}

                      {profile?.socialLinks?.twitter && (
                        <a
                          href={profile.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/30 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 hover:border-blue-400/50 rounded-xl transition-all group"
                        >
                          <div className="flex flex-col items-center">
                            <Twitter className="w-8 h-8 text-gray-300 group-hover:text-blue-300 mb-2" />
                            <span className="text-sm text-gray-400 group-hover:text-blue-300">Twitter</span>
                          </div>
                        </a>
                      )}

                      {profile?.socialLinks?.website && (
                        <a
                          href={profile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/30 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 hover:border-emerald-500/50 rounded-xl transition-all group"
                        >
                          <div className="flex flex-col items-center">
                            <Globe className="w-8 h-8 text-gray-300 group-hover:text-emerald-400 mb-2" />
                            <span className="text-sm text-gray-400 group-hover:text-emerald-400">Website</span>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <a
                      href={profile?.email ? `mailto:${profile.email}` : '#'}
                      className="block w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all text-center group"
                    >
                      <div className="flex items-center justify-center">
                        <Mail className="w-5 h-5 mr-3" />
                        Send Me a Message
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} {profile?.fullName || 'Portfolio'}. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Page generated at: {new Date(timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}