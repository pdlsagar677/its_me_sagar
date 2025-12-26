"use client";

import React, { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Sparkles,
  ArrowUp,
  Copyright,
  Globe,
} from "lucide-react";

// Profile interface
interface Profile {
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
    email: string;
  };
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch profile data to get social links - FIXED VERSION
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        
        
        const response = await fetch("/api/profile", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          cache: 'no-store' // Prevent caching issues
        });
        
       
        // First, check if it's JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Read as text first to check if it's PDF
          const text = await response.text();
          console.log("Footer: Response (first 50 chars):", text.substring(0, 50));
          
          if (text.startsWith('%PDF') || text.includes('PDF')) {
            console.error("Footer: Received PDF instead of JSON");
            setFetchError('Profile API returned PDF instead of JSON');
            
            // Try alternative: Use a query parameter to force JSON
            try {
              const retryResponse = await fetch('/api/profile?format=json', {
                headers: { 'Accept': 'application/json' }
              });
              const retryData = await retryResponse.json();
              if (retryData.success && retryData.profile) {
                setProfile(retryData.profile);
                return;
              }
            } catch (retryError) {
              console.error("Footer: Retry failed:", retryError);
            }
            return;
          }
          
          // Try to parse anyway if it looks like JSON
          try {
            const data = JSON.parse(text);
            if (data.success && data.profile) {
              setProfile(data.profile);
              return;
            }
          } catch (parseError) {
            console.error("Footer: Failed to parse response:", parseError);
            setFetchError('Invalid response format');
            return;
          }
        } else {
          // It's JSON, parse normally
          const data = await response.json();
          if (data.success && data.profile) {
            setProfile(data.profile);
          } else {
            setFetchError(data.error || 'Failed to fetch profile');
          }
        }
      } catch (error) {
        console.error("Footer: Error fetching profile:", error);
        setFetchError('Network error - could not fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get social links from profile or use fallbacks
  const socialLinks = [
    {
      icon: Github,
      href: profile?.socialLinks?.github || "https://github.com",
      label: "GitHub",
      color: "hover:text-white hover:border-white/50",
    },
    {
      icon: Linkedin,
      href: profile?.socialLinks?.linkedin || "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-400 hover:border-blue-500/50",
    },
   
    {
      icon: Globe,
      href: profile?.socialLinks?.website || "https://example.com",
      label: "Website",
      color: "hover:text-emerald-400 hover:border-emerald-500/50",
    },
    {
      icon: Mail,
      href: profile?.socialLinks?.email
        ? `mailto:${profile.socialLinks.email}`
        : "mailto:hello@example.com",
      label: "Email",
      color: "hover:text-orange-400 hover:border-orange-500/50",
    },
  ].filter((link) => link.href !== "#" && !link.href.includes('example.com')); // Remove empty or example links

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "Profile", href: "/profile" },
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
                <span className="text-sm text-gray-400">
                  Full Stack Engineer
                </span>
              </div>
            </div>

            <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
              Crafting digital experiences with modern technologies and clean
              design.
            </p>
          </div>

          {/* Quick Links & Social Links */}
          <div className="flex flex-col items-center md:items-end space-y-6">
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-orange-300 transition-colors duration-300 text-sm font-medium px-2 py-1 rounded-lg hover:bg-gray-800/30"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Social Links - Only show if we have data */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.label !== "Email" ? "_blank" : "_self"}
                  rel={social.label !== "Email" ? "noopener noreferrer" : ""}
                  className={`w-9 h-9 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 border border-gray-700/50 transition-all duration-300 group ${social.color}`}
                  aria-label={social.label}
                  title={social.label}
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>

            {/* Copyright & Error Message */}
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm flex items-center justify-center md:justify-end">
                <Copyright className="w-3 h-3 mr-1" />
                {currentYear} Made with by Sagar
              </p>
              {fetchError && (
                <p className="text-xs text-yellow-500 mt-1">
                  Note: Could not load social links
                </p>
              )}
            </div>
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