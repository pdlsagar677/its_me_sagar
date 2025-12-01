"use client";

import React from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Heart, 
  Sparkles,
  ArrowUp,
  Copyright
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer className="relative bg-gray-900 border-t border-gray-800 mt-20">
      {/* Gradient accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          
          {/* Logo & Brand */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gray-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  SAGAR
                </span>
                <span className="text-sm text-gray-400">Full Stack Engineer</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
              Crafting digital experiences with modern technologies and clean design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-orange-300 transition-colors duration-300 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-orange-300 hover:bg-gray-800 transition-all duration-300 border border-gray-700/50 hover:border-orange-500/30 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Copyright className="w-4 h-4" />
            <span>{currentYear} Portfolio. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>by</span>
            <span className="text-orange-300 font-medium">Developer</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-gray-900 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border-2 border-gray-900/20 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Optional: Floating particles effect (subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/20 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;