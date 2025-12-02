"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Shield,
  Calendar,
  Key,
  Upload,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Briefcase,
  MapPin,
  GlobeIcon as Earth,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || 'admin',
    email: user?.email || 'admin@sagar.com',
    phoneNumber: user?.phoneNumber || '+91 9876543210',
    bio: 'Full Stack Developer & Technical Lead with 5+ years of experience building scalable web applications. Passionate about modern JavaScript frameworks and cloud technologies.',
    location: 'Bangalore, India',
    website: 'https://sagar.com',
    github: 'https://github.com/sagar',
    twitter: 'https://twitter.com/sagar',
    linkedin: 'https://linkedin.com/in/sagar',
    role: 'Administrator',
    joinDate: 'January 2024',
    status: 'Active'
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Profile saved:', formData);
    setIsEditing(false);
    // In real app, call API here
  };

  const handlePasswordUpdate = () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Password updated');
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account information and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white font-medium rounded-xl transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-900" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Upload className="w-4 h-4 text-white" />
                  </button>
                )}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{formData.username}</h3>
                    <p className="text-orange-400 mb-1">Full Stack Developer</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {formData.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {formData.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-900/30 to-emerald-900/20 text-green-400 rounded-full text-sm border border-green-500/20">
                      <Shield className="w-3 h-3 inline mr-1" />
                      {formData.role}
                    </span>
                  </div>
                </div>
                
                {/* Bio */}
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-300">{formData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-400" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white font-medium">{formData.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white font-medium">{formData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white font-medium">{formData.phoneNumber}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-white">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {formData.location}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role</label>
                  <p className="text-white font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-orange-400" />
                    {formData.role}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Member Since</label>
                  <p className="text-white font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                    {formData.joinDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Social & Security */}
        <div className="space-y-6">
          {/* Social Links */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-400" />
              Social Links
            </h3>
            <div className="space-y-4">
              {[
                { icon: Earth, label: 'Website', value: formData.website, name: 'website' },
                { icon: Github, label: 'GitHub', value: formData.github, name: 'github' },
                { icon: Twitter, label: 'Twitter', value: formData.twitter, name: 'twitter' },
                { icon: Linkedin, label: 'LinkedIn', value: formData.linkedin, name: 'linkedin' },
              ].map((social, index) => (
                <div key={index}>
                  <label className="block text-sm text-gray-400 mb-2">{social.label}</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name={social.name}
                      value={social.value}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${social.label} URL`}
                    />
                  ) : (
                    <a
                      href={social.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <social.icon className="w-4 h-4 mr-2" />
                      <span className="truncate">{social.value.replace('https://', '')}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Key className="w-5 h-5 mr-2 text-purple-400" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={securityForm.newPassword}
                  onChange={handleSecurityChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={securityForm.confirmPassword}
                  onChange={handleSecurityChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handlePasswordUpdate}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl transition-all"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-700/30 rounded-xl p-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 mr-3" />
              <div>
                <h4 className="font-bold text-white mb-2">Account Status</h4>
                <p className="text-green-300 text-sm">Your account is active and secure</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-300">Two-factor authentication</span>
                    <span className="ml-auto text-green-400 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-300">Last login</span>
                    <span className="ml-auto text-gray-400">Today, 10:30 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}