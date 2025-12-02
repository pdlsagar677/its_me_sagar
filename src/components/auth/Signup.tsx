"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Code2,
  Rocket
} from 'lucide-react';

type Gender = 'male' | 'female' | 'other';

export default function SignupPage() {
  const router = useRouter();
  const { isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    gender: '' as Gender,
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }
    
    if (!formData.gender) {
      errors.gender = 'Please select a gender';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      setSuccessMessage('Account created successfully! Redirecting to login...');
      setFormErrors({});
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Signup failed'
      });
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

      <div className="w-full max-w-2xl z-10">
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

        {/* Signup Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
          {/* Header Banner */}
          <div className="relative p-8 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"></div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-float">
                  <UserPlus className="w-7 h-7 text-gray-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-gray-900 animate-pulse-slow"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                  Create Account
                </span>
                <p className="text-gray-400 mt-1">
                  Join SAGAR's portfolio platform
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border border-emerald-700/50 rounded-xl flex items-start animate-slideDown">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-emerald-300">
                  {successMessage}
                </span>
              </div>
            )}

            {/* Error Message */}
            {(error || formErrors.submit) && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-xl flex items-start animate-slideDown">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-red-300">
                  {error || formErrors.submit}
                </span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        formErrors.username 
                          ? 'border-red-500/50 focus:ring-red-500' 
                          : 'border-gray-600/50 hover:border-orange-500/50 focus:ring-orange-500'
                      }`}
                      placeholder="Enter your username"
                      disabled={isLoading || !!successMessage}
                    />
                  </div>
                  {formErrors.username && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.username}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        formErrors.email 
                          ? 'border-red-500/50 focus:ring-red-500' 
                          : 'border-gray-600/50 hover:border-orange-500/50 focus:ring-orange-500'
                      }`}
                      placeholder="Enter your email"
                      disabled={isLoading || !!successMessage}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        formErrors.phoneNumber 
                          ? 'border-red-500/50 focus:ring-red-500' 
                          : 'border-gray-600/50 hover:border-orange-500/50 focus:ring-orange-500'
                      }`}
                      placeholder="10-digit phone number"
                      maxLength={10}
                      disabled={isLoading || !!successMessage}
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Gender Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender *
                  </label>
                  <div className="relative group">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`block w-full py-3 px-4 bg-gray-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none ${
                        formErrors.gender 
                          ? 'border-red-500/50 focus:ring-red-500' 
                          : 'border-gray-600/50 hover:border-orange-500/50 focus:ring-orange-500'
                      }`}
                      disabled={isLoading || !!successMessage}
                    >
                      <option value="" className="bg-gray-800">Select gender</option>
                      <option value="male" className="bg-gray-800">Male</option>
                      <option value="female" className="bg-gray-800">Female</option>
                      <option value="other" className="bg-gray-800">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                    </div>
                  </div>
                  {formErrors.gender && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.gender}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
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
                      placeholder="At least 6 characters"
                      disabled={isLoading || !!successMessage}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-orange-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        formErrors.confirmPassword 
                          ? 'border-red-500/50 focus:ring-red-500' 
                          : 'border-gray-600/50 hover:border-orange-500/50 focus:ring-orange-500'
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading || !!successMessage}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-orange-400 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${formData.password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                    At least 6 characters long
                  </li>
                  <li className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                    Passwords match
                  </li>
                </ul>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded mt-1"
                  required
                  disabled={isLoading || !!successMessage}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-orange-400 hover:text-orange-300 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-orange-400 hover:text-orange-300 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!successMessage}
                className="w-full group relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                <span className="relative">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                      Creating account...
                    </>
                  ) : successMessage ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 inline-block" />
                      Success!
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2 inline-block" />
                      Create Account
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors group"
                >
                  Sign in here
                  <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}