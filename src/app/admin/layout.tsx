"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  LayoutDashboard,
  FolderKanban,
  User,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Home,
  UserCheckIcon,
  UserCircle2
} from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, checkAuth, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkAuth]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/unauthorized');
    }
  }, [user, router]);

  useEffect(() => {
    // Close sidebar on navigation on mobile
    if (sidebarOpen && isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, sidebarOpen, isMobile]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'posts', label: 'Posts', icon: FileText, path: '/admin/posts' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/admin/projects' },
    { id: 'profileinfo', label: 'ProfileInfo', icon: UserCircle2, path: '/admin/profileinfo' },

    { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:relative z-40 w-64 h-[calc(100vh-4rem)] bg-gray-800/50 backdrop-blur-lg border-r border-gray-700/50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          md:flex md:flex-col
        `}>
          {/* User Profile Card */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-900" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{user.username}</h3>
                <p className="text-sm text-orange-400">Administrator</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border border-transparent'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-orange-400" />
                    )}
                  </Link>
                );
              })}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-500/20 w-full text-left mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Back to Portfolio */}
            <div className="mt-8 p-4">
              <Link
                href="/"
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-xl text-orange-300 hover:bg-orange-500/20 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="w-4 h-4 mr-2" />
                View Portfolio
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`
          flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-4rem)]
          transition-all duration-300
          ${sidebarOpen ? 'ml-64 md:ml-0' : 'ml-0'}
        `}>
          {/* Backdrop for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}