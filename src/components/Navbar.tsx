"use client";

import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Briefcase, 
  Mail, 
  User, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

const PortfolioNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'service', label: 'Services', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>

      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        {/* Animated gradient line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-orange-500/70 to-transparent animate-shimmer"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Enhanced with more polish */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-float">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-gray-900 animate-pulse-slow"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                  SAGAR
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-wide">Full Stack Engineer</span>
              </div>
            </div>

            {/* Desktop Navigation - More refined */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-800/40 backdrop-blur-sm rounded-2xl px-2 py-2 border border-gray-700/50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    activeNav === item.id 
                      ? 'text-orange-300 bg-gradient-to-r from-orange-500/10 to-orange-600/5' 
                      : 'text-gray-300 hover:text-orange-200 hover:bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <item.icon className={`w-4 h-4 transition-transform duration-300 ${
                      activeNav === item.id ? 'scale-110' : 'scale-100'
                    }`} />
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </div>
                  
                  {/* Active indicator - More subtle */}
                  {activeNav === item.id && (
                    <>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full blur-sm"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></div>
                    </>
                  )}
                </button>
              ))}
            </div>

          

            {/* Mobile menu button - Enhanced */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced with glass effect */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-gray-900/95 to-gray-900 backdrop-blur-lg border-t border-gray-800 animate-slideDown">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                    activeNav === item.id
                      ? 'bg-gradient-to-r from-orange-500/15 to-orange-600/5 text-orange-300 border border-orange-500/20'
                      : 'text-gray-300 hover:bg-gray-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activeNav === item.id 
                        ? 'bg-orange-500/20' 
                        : 'bg-gray-800/50'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {activeNav === item.id && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
              
             
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default PortfolioNavbar;