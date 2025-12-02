"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { 
  Mail, 
  Lock, 
  User, 
  LogIn, 
  Eye, 
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Code2,
  Shield,
  Home
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.emailOrUsername.trim()) {
      errors.emailOrUsername = 'Email or username is required';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setRedirecting(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Update auth store with user data
      login(data.user);
      
      // Redirect based on user role
      if (data.user.isAdmin) {
        // Admin users go to admin dashboard
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 500);
      } else {
        // Regular users go to homepage
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 500);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Login failed'
      });
      setRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-orange-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to portfolio
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50 relative">
          {/* Animated gradient line */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl mb-4 shadow-lg shadow-orange-500/20 animate-float">
              <LogIn className="w-7 h-7 text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">
              Sign in to access SAGAR's portfolio
            </p>
          </div>

          {/* Redirecting Message */}
          {redirecting && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-xl flex items-center justify-center animate-slideDown">
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span className="text-blue-300">
                  Logging in and redirecting...
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(error || formErrors.submit) && !redirecting && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-xl flex items-start animate-slideDown">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-red-300 text-sm">
                {error || formErrors.submit}
              </span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email or Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    formErrors.emailOrUsername 
                      ? 'border-red-500/50 focus:ring-red-500' 
                      : 'border-gray-600/50 hover:border-orange-500/50 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your email or username"
                  disabled={isLoading || redirecting}
                />
              </div>
              {formErrors.emailOrUsername && !redirecting && (
                <p className="mt-2 text-sm text-red-400">
                  {formErrors.emailOrUsername}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    formErrors.password 
                      ? 'border-red-500/50 focus:ring-red-500' 
                      : 'border-gray-600/50 hover:border-orange-500/50 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading || redirecting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-orange-400 transition-colors disabled:opacity-50"
                  disabled={isLoading || redirecting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formErrors.password && !redirecting && (
                <p className="mt-2 text-sm text-red-400">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || redirecting}
              className="w-full group relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
              <span className="relative">
                {isLoading || redirecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                    {redirecting ? 'Redirecting...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2 inline-block" />
                    Sign In
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-700/50"></div>
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700/50"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors group"
              >
                Create account
                <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-orange-400 hover:text-orange-300 hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-orange-400 hover:text-orange-300 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 bg-gradient-to-br from-orange-900/20 to-amber-900/10 border border-orange-700/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-orange-300 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Demo Credentials
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-orange-200/80 mb-1 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Admin Account
              </h4>
              <div className="text-sm text-orange-200/70 space-y-1 ml-4">
                <p>Email: admin@sagar.com</p>
                <p>Username: admin</p>
                <p>Password: admin123</p>
                <p className="text-xs text-orange-300/50 mt-1">
                  ↳ Redirects to Admin Dashboard
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-orange-700/30">
              <h4 className="text-xs font-medium text-orange-200/80 mb-1 flex items-center">
                <Home className="w-3 h-3 mr-1" />
                User Account
              </h4>
              <div className="text-sm text-orange-200/70 space-y-1 ml-4">
                <p>Email: user@sagar.com</p>
                <p>Username: user</p>
                <p>Password: user123</p>
                <p className="text-xs text-orange-300/50 mt-1">
                  ↳ Redirects to Homepage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link 
            href="/portfolio" 
            className="p-3 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl text-center group transition-all"
          >
            <div className="flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-orange-400 mr-2" />
              <span className="text-gray-300 group-hover:text-white text-sm">Portfolio</span>
            </div>
          </Link>
          <Link 
            href="/projects" 
            className="p-3 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl text-center group transition-all"
          >
            <div className="flex items-center justify-center">
              <Code2 className="w-4 h-4 text-gray-400 group-hover:text-orange-400 mr-2" />
              <span className="text-gray-300 group-hover:text-white text-sm">Projects</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}