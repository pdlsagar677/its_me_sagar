"use client";

import React from 'react';
import { 
  ArrowRight, 
  Code, 
  Palette, 
  Rocket, 
  CheckCircle, 
  Sparkles,
  ExternalLink,
  ChevronRight,Mail
} from 'lucide-react';

const HomePage = () => {
  const projects = [
    { title: 'E-Commerce Platform', category: 'Full Stack', tech: 'Next.js · Node.js' },
    { title: 'Analytics Dashboard', category: 'Frontend', tech: 'React · D3.js' },
    { title: 'Mobile App UI', category: 'UI/UX', tech: 'React Native · Figma' },
  ];

  const skills = [
    { name: 'React/Next.js', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'UI/UX Design', level: 80 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-300">Full Stack Developer</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-300">Crafting</span>
                <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                  Digital Experiences
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl">
                I build modern, performant web applications with clean code and 
                exceptional user experiences. Specializing in React, Next.js, and 
                full-stack development.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-gray-900 font-semibold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2 shadow-lg shadow-orange-500/20">
                  <span>View Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group px-8 py-4 bg-gray-800/50 text-gray-300 font-semibold rounded-xl hover:bg-gray-800 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 flex items-center space-x-2">
                  <span>Contact Me</span>
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">50+</h3>
                <p className="text-gray-400 mt-2">Projects Completed</p>
              </div>

              <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">24</h3>
                <p className="text-gray-400 mt-2">Happy Clients</p>
              </div>

              <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">3+</h3>
                <p className="text-gray-400 mt-2">Years Experience</p>
              </div>

              <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">100%</h3>
                <p className="text-gray-400 mt-2">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Technical <span className="text-orange-400">Expertise</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Proficient in modern web technologies and dedicated to continuous learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">{skill.name}</span>
                  <span className="text-orange-400 font-bold">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured <span className="text-orange-400">Projects</span>
              </h2>
              <p className="text-gray-400">A selection of my recent work</p>
            </div>
            <button className="hidden md:flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors">
              <span>View All</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300 hover:translate-y-[-5px] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span className="text-4xl font-bold text-gray-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{project.tech}</p>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-orange-400 transition-colors">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Let's Build Something <span className="text-orange-400">Amazing</span> Together
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Have a project in mind? I'd love to hear about it. Let's discuss 
                how we can bring your ideas to life.
              </p>
              <button className="group px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-gray-900 font-semibold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2 shadow-lg shadow-orange-500/20 mx-auto">
                <span>Start a Conversation</span>
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;