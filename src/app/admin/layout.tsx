"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  LayoutDashboard,
  FolderKanban,
  User,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  UserCircle2,
  FolderCheckIcon,
} from "lucide-react";

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

    // Check if mobile and set initial sidebar state
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // open on desktop, closed on mobile
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [checkAuth]);

  useEffect(() => {
    // Guard: if authenticated but not admin, redirect
    if (user && !user.isAdmin) {
      router.push("/unauthorized");
    }
  }, [user, router]);

  // Close sidebar when route changes (only), and only on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    // only depend on pathname and isMobile so toggling sidebar doesn't immediately close it
  }, [pathname, isMobile]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen && isMobile) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, isMobile]);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobile, sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen((s) => !s);
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
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    { id: "posts", label: "Posts", icon: FileText, path: "/admin/posts" },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
      path: "/admin/projects",
    },
    {
      id: "AddProjects",
      label: "Add Projects",
      icon: FolderCheckIcon,
      path: "/admin/addProjects",
    },
    {
      id: "profileinfo",
      label: "ProfileInfo",
      icon: UserCircle2,
      path: "/admin/profileinfo",
    },
    { id: "profile", label: "Profile", icon: User, path: "/admin/profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Top Header with Menu Toggle (mobile only) */}
      <header className="sticky top-0 z-50 bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
            <h1 className="text-white font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-gray-900" />
            </div>
            <span className="text-sm text-gray-300 truncate max-w-[100px]">
              {user.username}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 md:top-4 left-0 z-40 w-64 h-screen md:h-[calc(100vh-2rem)]
            bg-gray-800/90 backdrop-blur-lg border-r border-gray-700/50
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:ml-4 md:my-4 md:rounded-xl
            md:h-[calc(100vh-2rem)] flex flex-col
          `}
        >
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-700/50">
            <h2 className="text-white font-bold text-lg">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-6 border-b border-gray-700/50 md:mt-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-900" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
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
                      ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/20"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50 border border-transparent"
                      }
                    `}
                    onClick={() => {
                      if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-orange-400" : ""}`}
                    />
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
                onClick={() => {
                  if (isMobile) setSidebarOpen(false);
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                View Portfolio
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`
            flex-1 p-4 md:p-6 overflow-y-auto min-h-screen
            ${isMobile ? "pt-16" : "md:pt-4"}
            ${sidebarOpen && isMobile ? "opacity-50" : "opacity-100"}
            transition-opacity duration-300
          `}
        >
          {/* Backdrop for mobile sidebar */}
          {sidebarOpen && isMobile && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
