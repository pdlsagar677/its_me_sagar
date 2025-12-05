"use client";

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Globe, 
  FileText, 
  Upload, 
  Trash2, 
  Save,
  Edit,
  X,
  Check,
  Image as ImageIcon,
  Link,
  Award,
  GraduationCap,
  Star,
  Download,
  Plus,
  Sparkles,
  Code,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  BookOpen,
  Settings,
  Zap,
  FolderOpen
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const ProfileInfo = () => {
  const { 
    profile, 
    fetchProfile, 
    updateProfile, 
    uploadProfileImage, 
    uploadCoverImage, 
    uploadCV,
    deleteProfileImage,
    deleteCoverImage,
    deleteCV,
    updateSocialLinks,
    updateSkills,
    updateTechnologies,
    updateExperience,
    updateEducation,
    updateCertifications,
    toggleProfilePublish,
    isLoading 
  } = useAdminStore();

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    description: '',
    bio: '',
    location: '',
    contactEmail: '',
    hourlyRate: '',
    availability: true,
  });

  // Social links state
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    website: '',
    youtube: '',
    dribbble: '',
    behance: '',
    medium: '',
    stackoverflow: '',
  });

  // Experience state
  const [experience, setExperience] = useState({
    years: 0,
    title: '',
    description: '',
    projectsCompleted: 0,
    clientsCount: 0,
    companies: [] as Array<{
      name: string;
      position: string;
      duration: string;
      description: string;
    }>,
  });

  // Skills state with better management
  const [skills, setSkills] = useState<Array<{
    id: string;
    category: string;
    items: string[];
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>>([]);

  // Technologies state
  const [technologies, setTechnologies] = useState<string[]>([]);

  // Education state
  const [education, setEducation] = useState<Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>>([]);

  // Certifications state
  const [certifications, setCertifications] = useState<Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
    url: string;
  }>>([]);

  // File states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    skills: true,
    experience: true,
    education: true,
    certifications: true,
    social: true,
    technologies: true
  });

  // Add form states
  const [newSkill, setNewSkill] = useState({
    category: '',
    item: '',
    level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert'
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '',
    description: ''
  });
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    year: '',
    url: ''
  });
  const [newCompany, setNewCompany] = useState({
    name: '',
    position: '',
    duration: '',
    description: ''
  });

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Load profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        title: profile.title || '',
        description: profile.description || '',
        bio: profile.bio || '',
        location: profile.location || '',
        contactEmail: profile.contactEmail || '',
        hourlyRate: profile.hourlyRate?.toString() || '',
        availability: profile.availability || true,
      });

      setSocialLinks(profile.socialLinks || {
        github: '', linkedin: '', twitter: '', facebook: '', instagram: '',
        website: '', youtube: '', dribbble: '', behance: '', medium: '', stackoverflow: ''
      });

      setExperience(profile.experience || {
        years: 0, title: '', description: '', projectsCompleted: 0, clientsCount: 0, companies: []
      });

      setSkills((profile.skills || []).map(skill => ({ ...skill, id: generateId() })));
      setTechnologies(profile.technologies || []);
      setEducation((profile.education || []).map(edu => ({ ...edu, id: generateId() })));
      setCertifications((profile.certifications || []).map(cert => ({ ...cert, id: generateId() })));
    }
  }, [profile]);

  // Handle basic info changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle social links changes
  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  // Handle experience changes
  const handleExperienceChange = (field: string, value: string | number) => {
    setExperience(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file uploads
  const handleFileUpload = async (type: 'profile' | 'cover' | 'cv') => {
    const file = type === 'profile' ? profileImage : 
                 type === 'cover' ? coverImage : cvFile;
    
    if (!file) {
      toast.error(`Please select a ${type} file`);
      return;
    }

    try {
      if (type === 'profile') {
        await uploadProfileImage(file);
        toast.success('Profile image uploaded successfully');
        setProfileImage(null);
      } else if (type === 'cover') {
        await uploadCoverImage(file);
        toast.success('Cover image uploaded successfully');
        setCoverImage(null);
      } else if (type === 'cv') {
        await uploadCV(file);
        toast.success('CV uploaded successfully');
        setCvFile(null);
      }
    } catch (error) {
      console.error(`Upload ${type} error:`, error);
      toast.error(`Failed to upload ${type}`);
    }
  };

  // Handle file deletions
  const handleFileDelete = async (type: 'profile' | 'cover' | 'cv') => {
    try {
      if (type === 'profile') {
        await deleteProfileImage();
        toast.success('Profile image deleted');
      } else if (type === 'cover') {
        await deleteCoverImage();
        toast.success('Cover image deleted');
      } else if (type === 'cv') {
        await deleteCV();
        toast.success('CV deleted');
      }
    } catch (error) {
      console.error(`Delete ${type} error:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  // Save basic info
  const saveBasicInfo = async () => {
    try {
      await updateProfile({
        ...formData,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined
      });
      toast.success('Basic information saved');
      setIsEditing(false);
    } catch (error) {
      console.error('Save basic info error:', error);
      toast.error('Failed to save basic information');
    }
  };

  // Save social links
  const saveSocialLinks = async () => {
    try {
      await updateSocialLinks(socialLinks);
      toast.success('Social links saved');
      setEditingSection(null);
    } catch (error) {
      console.error('Save social links error:', error);
      toast.error('Failed to save social links');
    }
  };

  // Save experience
  const saveExperience = async () => {
    try {
      await updateExperience(experience);
      toast.success('Experience saved');
    } catch (error) {
      console.error('Save experience error:', error);
      toast.error('Failed to save experience');
    }
  };

  // Save skills
  const saveSkills = async () => {
    try {
      // Remove IDs before saving
      const skillsToSave = skills.map(({ id, ...skill }) => skill);
      await updateSkills(skillsToSave);
      toast.success('Skills saved');
    } catch (error) {
      console.error('Save skills error:', error);
      toast.error('Failed to save skills');
    }
  };

  // Save technologies
  const saveTechnologies = async () => {
    try {
      await updateTechnologies(technologies);
      toast.success('Technologies saved');
    } catch (error) {
      console.error('Save technologies error:', error);
      toast.error('Failed to save technologies');
    }
  };

  // Save education
  const saveEducation = async () => {
    try {
      // Remove IDs before saving
      const educationToSave = education.map(({ id, ...edu }) => edu);
      await updateEducation(educationToSave);
      toast.success('Education saved');
    } catch (error) {
      console.error('Save education error:', error);
      toast.error('Failed to save education');
    }
  };

  // Save certifications
  const saveCertifications = async () => {
    try {
      // Remove IDs before saving
      const certificationsToSave = certifications.map(({ id, ...cert }) => cert);
      await updateCertifications(certificationsToSave);
      toast.success('Certifications saved');
    } catch (error) {
      console.error('Save certifications error:', error);
      toast.error('Failed to save certifications');
    }
  };

  // Add technology
  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
      toast.success('Technology added');
    }
  };

  // Remove technology
  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
    toast.success('Technology removed');
  };

  // Add skill
  const addSkill = () => {
    if (newSkill.category.trim() && newSkill.item.trim()) {
      const existingCategory = skills.find(s => s.category === newSkill.category.trim());
      
      if (existingCategory) {
        // Add item to existing category
        if (!existingCategory.items.includes(newSkill.item.trim())) {
          const updatedSkills = skills.map(skill => 
            skill.id === existingCategory.id 
              ? { ...skill, items: [...skill.items, newSkill.item.trim()] }
              : skill
          );
          setSkills(updatedSkills);
          toast.success('Skill added to category');
        } else {
          toast.error('Skill already exists in this category');
        }
      } else {
        // Create new category
        const newSkillObj = {
          id: generateId(),
          category: newSkill.category.trim(),
          items: [newSkill.item.trim()],
          level: newSkill.level
        };
        setSkills([...skills, newSkillObj]);
        toast.success('New skill category created');
      }
      
      // Reset form
      setNewSkill({ category: '', item: '', level: 'intermediate' });
    }
  };

  // Remove skill item
  const removeSkillItem = (skillId: string, itemIndex: number) => {
    const updatedSkills = skills.map(skill => {
      if (skill.id === skillId) {
        const newItems = [...skill.items];
        newItems.splice(itemIndex, 1);
        return { ...skill, items: newItems };
      }
      return skill;
    }).filter(skill => skill.items.length > 0); // Remove empty categories
    
    setSkills(updatedSkills);
    toast.success('Skill removed');
  };

  // Remove skill category
  const removeSkillCategory = (skillId: string) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
    toast.success('Skill category removed');
  };

  // Add education
  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setEducation([...education, { ...newEducation, id: generateId() }]);
      setNewEducation({ degree: '', institution: '', year: '', description: '' });
      toast.success('Education added');
    }
  };

  // Update education
  const updateEducationItem = (id: string, updates: Partial<typeof newEducation>) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, ...updates } : edu
    ));
  };

  // Remove education
  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
    toast.success('Education removed');
  };

  // Add certification
  const addCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      setCertifications([...certifications, { ...newCertification, id: generateId() }]);
      setNewCertification({ name: '', issuer: '', year: '', url: '' });
      toast.success('Certification added');
    }
  };

  // Update certification
  const updateCertificationItem = (id: string, updates: Partial<typeof newCertification>) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, ...updates } : cert
    ));
  };

  // Remove certification
  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    toast.success('Certification removed');
  };

  // Add company
  const addCompany = () => {
    if (newCompany.name.trim() && newCompany.position.trim()) {
      setExperience(prev => ({
        ...prev,
        companies: [...prev.companies, { ...newCompany }]
      }));
      setNewCompany({ name: '', position: '', duration: '', description: '' });
      toast.success('Work experience added');
    }
  };

  // Update company
  const updateCompany = (index: number, updates: Partial<typeof newCompany>) => {
    const updatedCompanies = [...experience.companies];
    updatedCompanies[index] = { ...updatedCompanies[index], ...updates };
    setExperience(prev => ({ ...prev, companies: updatedCompanies }));
  };

  // Remove company
  const removeCompany = (index: number) => {
    setExperience(prev => ({
      ...prev,
      companies: prev.companies.filter((_, i) => i !== index)
    }));
    toast.success('Work experience removed');
  };

  // Toggle profile publish
  const togglePublish = async () => {
    try {
      await toggleProfilePublish(!profile?.isPublished);
      toast.success(`Profile ${!profile?.isPublished ? 'published' : 'unpublished'}`);
    } catch (error) {
      console.error('Toggle publish error:', error);
      toast.error('Failed to update profile status');
    }
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Save all sections
  const saveAllSections = async () => {
    try {
      await Promise.all([
        saveBasicInfo(),
        saveSocialLinks(),
        saveExperience(),
        saveSkills(),
        saveTechnologies(),
        saveEducation(),
        saveCertifications()
      ]);
      toast.success('All changes saved successfully');
    } catch (error) {
      toast.error('Failed to save some sections');
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-blue-500/30 p-8 mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/10 rounded-xl border border-blue-500/20">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
                  <p className="text-gray-600 mt-2">Manage your portfolio profile and information</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-800/20 to-gray-700/10 backdrop-blur-sm rounded-lg p-3 border border-gray-600/20">
                  <div className={`w-3 h-3 rounded-full ${profile?.isPublished ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium text-gray-800">
                    {profile?.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <button
                  onClick={togglePublish}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    profile?.isPublished 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 text-yellow-800 hover:from-yellow-500/30 hover:to-amber-500/20 border border-yellow-500/30' 
                    : 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-800 hover:from-green-500/30 hover:to-emerald-500/20 border border-green-500/30'
                  }`}
                >
                  {profile?.isPublished ? 'Unpublish' : 'Publish Now'}
                </button>
                <button
                  onClick={saveAllSections}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save All
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {skills.reduce((acc, skill) => acc + skill.items.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Skills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {technologies.length}
                </div>
                <div className="text-sm text-gray-600">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {experience.companies.length}
                </div>
                <div className="text-sm text-gray-600">Work Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {education.length}
                </div>
                <div className="text-sm text-gray-600">Education</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Media Uploads */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image Upload */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/10 rounded-lg border border-blue-500/20 mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  Profile Image
                </h2>
                {profile?.profileImage && (
                  <button
                    onClick={() => handleFileDelete('profile')}
                    className="p-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                {profile?.profileImage ? (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={profile.profileImage}
                      alt="Profile"
                      width={192}
                      height={192}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                <div className="mt-6 w-full">
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all group">
                      <Upload className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-700 font-medium">Upload New Image</span>
                    </div>
                  </label>
                  {profileImage && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Selected:</p>
                          <p className="text-xs text-gray-500 truncate">{profileImage.name}</p>
                        </div>
                        <button
                          onClick={() => handleFileUpload('profile')}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                        >
                          Upload Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-lg border border-emerald-500/20 mr-3">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  Cover Image
                </h2>
                {profile?.coverImage && (
                  <button
                    onClick={() => handleFileDelete('cover')}
                    className="p-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center">
                {profile?.coverImage ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                    <Image
                      src={profile.coverImage}
                      alt="Cover"
                      width={800}
                      height={192}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                <div className="mt-6 w-full">
                  <input
                    type="file"
                    id="cover-image"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="cover-image" className="cursor-pointer">
                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group">
                      <Upload className="w-5 h-5 mr-3 text-gray-500 group-hover:text-emerald-600" />
                      <span className="text-gray-700 group-hover:text-emerald-700 font-medium">Upload Cover Image</span>
                    </div>
                  </label>
                  {coverImage && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Selected:</p>
                          <p className="text-xs text-gray-500 truncate">{coverImage.name}</p>
                        </div>
                        <button
                          onClick={() => handleFileUpload('cover')}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
                        >
                          Upload Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CV Upload */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-lg border border-purple-500/20 mr-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  Resume/CV
                </h2>
                {profile?.cvUrl && (
                  <div className="flex items-center space-x-2">
                    <a
                      href={profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors"
                      title="Download CV"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleFileDelete('cv')}
                      className="p-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                      title="Delete CV"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {profile?.cvUrl ? (
                    <div className="text-center mb-4">
                      <p className="text-emerald-600 font-medium mb-2">✓ CV uploaded successfully</p>
                      <p className="text-xs text-gray-500">Click the download icon to view</p>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 mb-4">
                      Upload your resume or CV (PDF recommended)
                    </p>
                  )}

                  <input
                    type="file"
                    id="cv-file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="cv-file" className="cursor-pointer">
                    <div className="flex items-center justify-center p-4 bg-gradient-to-r from-gray-100 to-gray-200/50 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all group">
                      <Upload className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700" />
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Select CV File</span>
                    </div>
                  </label>
                  {cvFile && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50/50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Selected:</p>
                          <p className="text-xs text-gray-500 truncate">{cvFile.name}</p>
                        </div>
                        <button
                          onClick={() => handleFileUpload('cv')}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                        >
                          Upload Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/10 rounded-xl border border-blue-500/20">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center font-medium"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Done Editing
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Information
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                      Professional Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="Full Stack Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Tagline / Headline
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="Passionate about creating amazing web experiences"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Contact Email (Public)
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Bio / About Me
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-800 font-medium"
                  placeholder="Write a detailed bio about yourself..."
                />
              </div>

              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="availability" className="ml-3 block text-sm font-medium text-gray-800">
                  Available for work & freelance opportunities
                </label>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={saveBasicInfo}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Social Links Card */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-xl border border-purple-500/20">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
                </div>
                <button
                  onClick={() => toggleSection('social')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedSections.social ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {expandedSections.social && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    {Object.entries(socialLinks).map(([platform, url]) => (
                      <div key={platform} className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 flex items-center">
                          <Link className="w-4 h-4 mr-2 text-purple-600" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </label>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 font-medium"
                          placeholder={`https://${platform}.com/username`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={saveSocialLinks}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Social Links
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Experience Card */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/10 rounded-xl border border-amber-500/20">
                    <Briefcase className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                </div>
                <button
                  onClick={() => toggleSection('experience')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedSections.experience ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {expandedSections.experience && (
                <>
                  <div className="space-y-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={experience.years}
                          onChange={(e) => handleExperienceChange('years', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Experience Title
                        </label>
                        <input
                          type="text"
                          value={experience.title}
                          onChange={(e) => handleExperienceChange('title', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                          placeholder="Senior Developer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Projects Completed
                        </label>
                        <input
                          type="number"
                          value={experience.projectsCompleted}
                          onChange={(e) => handleExperienceChange('projectsCompleted', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Clients Count
                        </label>
                        <input
                          type="number"
                          value={experience.clientsCount}
                          onChange={(e) => handleExperienceChange('clientsCount', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Experience Description
                      </label>
                      <textarea
                        value={experience.description}
                        onChange={(e) => handleExperienceChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                      />
                    </div>

                    {/* Add Company Form */}
                    <div className="p-5 border border-dashed border-amber-300 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/50">
                      <h4 className="font-bold text-gray-800 mb-4">Add Work Experience</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={newCompany.name}
                          onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                          placeholder="Company Name"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                        />
                        <input
                          type="text"
                          value={newCompany.position}
                          onChange={(e) => setNewCompany({...newCompany, position: e.target.value})}
                          placeholder="Position"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                        />
                        <input
                          type="text"
                          value={newCompany.duration}
                          onChange={(e) => setNewCompany({...newCompany, duration: e.target.value})}
                          placeholder="Duration (e.g., 2020-2022)"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-medium"
                        />
                      </div>
                      <textarea
                        value={newCompany.description}
                        onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                        placeholder="Role description and achievements..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 mb-4 text-gray-800 font-medium"
                      />
                      <button
                        onClick={addCompany}
                        className="w-full px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all flex items-center justify-center font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Work Experience
                      </button>
                    </div>

                    {/* Companies List */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-800">Work Experience ({experience.companies.length})</h4>
                      {experience.companies.map((company, index) => (
                        <div key={index} className="p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={company.name}
                                onChange={(e) => updateCompany(index, { name: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium text-lg"
                                placeholder="Company Name"
                              />
                              <input
                                type="text"
                                value={company.position}
                                onChange={(e) => updateCompany(index, { position: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 font-medium"
                                placeholder="Position"
                              />
                              <input
                                type="text"
                                value={company.duration}
                                onChange={(e) => updateCompany(index, { duration: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-500"
                                placeholder="Duration"
                              />
                            </div>
                            <button
                              onClick={() => removeCompany(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            value={company.description}
                            onChange={(e) => updateCompany(index, { description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
                            placeholder="Description"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={saveExperience}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all flex items-center font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Experience
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Skills & Technologies Card */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-xl border border-emerald-500/20">
                    <Star className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Skills & Technologies</h2>
                </div>
                <button
                  onClick={() => toggleSection('skills')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedSections.skills ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {expandedSections.skills && (
                <>
                  {/* Skills Section */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Skills</h3>
                    
                    {/* Add Skill Form */}
                    <div className="mb-6 p-5 border border-dashed border-emerald-300 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50">
                      <h4 className="font-bold text-gray-800 mb-4">Add New Skill</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          value={newSkill.category}
                          onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                          placeholder="Category (e.g., Frontend)"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                        />
                        <input
                          type="text"
                          value={newSkill.item}
                          onChange={(e) => setNewSkill({...newSkill, item: e.target.value})}
                          placeholder="Skill (e.g., React)"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                        />
                        <select
                          value={newSkill.level}
                          onChange={(e) => setNewSkill({...newSkill, level: e.target.value as any})}
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <button
                        onClick={addSkill}
                        className="w-full px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </button>
                    </div>

                    {/* Skills List */}
                    <div className="space-y-4">
                      {skills.map((skillCategory) => (
                        <div key={skillCategory.id} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-gray-100/50">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={skillCategory.category}
                                onChange={(e) => {
                                  const updatedSkills = skills.map(skill => 
                                    skill.id === skillCategory.id 
                                      ? { ...skill, category: e.target.value }
                                      : skill
                                  );
                                  setSkills(updatedSkills);
                                }}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium text-lg"
                              />
                              <select
                                value={skillCategory.level}
                                onChange={(e) => {
                                  const updatedSkills = skills.map(skill => 
                                    skill.id === skillCategory.id 
                                      ? { ...skill, level: e.target.value as any }
                                      : skill
                                  );
                                  setSkills(updatedSkills);
                                }}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                              </select>
                            </div>
                            <button
                              onClick={() => removeSkillCategory(skillCategory.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {skillCategory.items.map((item, itemIndex) => (
                              <span key={itemIndex} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-800 text-sm font-medium">
                                <Code className="w-3 h-3 mr-1.5" />
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const updatedItems = [...skillCategory.items];
                                    updatedItems[itemIndex] = e.target.value;
                                    const updatedSkills = skills.map(skill => 
                                      skill.id === skillCategory.id 
                                        ? { ...skill, items: updatedItems }
                                        : skill
                                    );
                                    setSkills(updatedSkills);
                                  }}
                                  className="bg-transparent border-none outline-none text-emerald-800"
                                  style={{ width: `${item.length}ch` }}
                                />
                                <button
                                  onClick={() => removeSkillItem(skillCategory.id, itemIndex)}
                                  className="ml-1.5 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                            <button
                              onClick={() => {
                                const updatedSkills = skills.map(skill => 
                                  skill.id === skillCategory.id 
                                    ? { ...skill, items: [...skill.items, 'New Skill'] }
                                    : skill
                                );
                                setSkills(updatedSkills);
                              }}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-700 hover:text-gray-900 text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Skill
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Technologies</h3>
                    
                    {/* Add Technology Form */}
                    <div className="mb-6">
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={newTechnology}
                          onChange={(e) => setNewTechnology(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                          placeholder="Add a technology (e.g., React, Node.js)"
                          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium"
                        />
                        <button
                          onClick={addTechnology}
                          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center font-medium"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Technologies List */}
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-800 text-sm font-medium">
                          <Code className="w-3 h-3 mr-1.5" />
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => {
                              const updatedTech = [...technologies];
                              updatedTech[index] = e.target.value;
                              setTechnologies(updatedTech);
                            }}
                            className="bg-transparent border-none outline-none text-blue-800"
                            style={{ width: `${tech.length}ch` }}
                          />
                          <button
                            onClick={() => removeTechnology(tech)}
                            className="ml-1.5 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      onClick={saveSkills}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
                    >
                      Save Skills
                    </button>
                    <button
                      onClick={saveTechnologies}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                    >
                      Save Technologies
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Education & Certifications Card */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-xl border border-purple-500/20">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Education & Certifications</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleSection('education')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedSections.education ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {expandedSections.education && (
                <>
                  {/* Education Section */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Education</h3>
                    
                    {/* Add Education Form */}
                    <div className="mb-6 p-5 border border-dashed border-purple-300 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50/50">
                      <h4 className="font-bold text-gray-800 mb-4">Add Education</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                          placeholder="Degree (e.g., B.Sc Computer Science)"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 font-medium"
                        />
                        <input
                          type="text"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                          placeholder="Institution"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 font-medium"
                        />
                        <input
                          type="text"
                          value={newEducation.year}
                          onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                          placeholder="Year (e.g., 2018-2022)"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 font-medium"
                        />
                      </div>
                      <textarea
                        value={newEducation.description}
                        onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
                        placeholder="Additional details, achievements, or relevant coursework..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4 text-gray-800 font-medium"
                      />
                      <button
                        onClick={addEducation}
                        className="w-full px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </button>
                    </div>

                    {/* Education List */}
                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducationItem(edu.id, { degree: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium text-lg"
                                placeholder="Degree"
                              />
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducationItem(edu.id, { institution: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 font-medium"
                                placeholder="Institution"
                              />
                              <input
                                type="text"
                                value={edu.year}
                                onChange={(e) => updateEducationItem(edu.id, { year: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-500"
                                placeholder="Year"
                              />
                            </div>
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                              title="Remove education"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            value={edu.description}
                            onChange={(e) => updateEducationItem(edu.id, { description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
                            placeholder="Description"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Certifications</h3>
                    
                    {/* Add Certification Form */}
                    <div className="mb-6 p-5 border border-dashed border-blue-300 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50">
                      <h4 className="font-bold text-gray-800 mb-4">Add Certification</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={newCertification.name}
                          onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                          placeholder="Certification Name"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium"
                        />
                        <input
                          type="text"
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                          placeholder="Issuing Organization"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium"
                        />
                        <input
                          type="text"
                          value={newCertification.year}
                          onChange={(e) => setNewCertification({...newCertification, year: e.target.value})}
                          placeholder="Year"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium"
                        />
                        <input
                          type="url"
                          value={newCertification.url}
                          onChange={(e) => setNewCertification({...newCertification, url: e.target.value})}
                          placeholder="Certificate URL"
                          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium"
                        />
                      </div>
                      <button
                        onClick={addCertification}
                        className="w-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </button>
                    </div>

                    {/* Certifications List */}
                    <div className="space-y-4">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertificationItem(cert.id, { name: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium text-lg"
                                placeholder="Certification Name"
                              />
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertificationItem(cert.id, { issuer: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 font-medium"
                                placeholder="Issuing Organization"
                              />
                              <input
                                type="text"
                                value={cert.year}
                                onChange={(e) => updateCertificationItem(cert.id, { year: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-500"
                                placeholder="Year"
                              />
                              <input
                                type="url"
                                value={cert.url}
                                onChange={(e) => updateCertificationItem(cert.id, { url: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-blue-600"
                                placeholder="Certificate URL"
                              />
                            </div>
                            <button
                              onClick={() => removeCertification(cert.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                              title="Remove certification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      onClick={saveEducation}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    >
                      Save Education
                    </button>
                    <button
                      onClick={saveCertifications}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                    >
                      Save Certifications
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;