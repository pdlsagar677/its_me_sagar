"use client";

import React, { useState } from "react";
import { 
  Layers, 
  Code, 
  Cpu, 
  Smartphone, 
  Wrench, 
  CreditCard, 
  Server, 
  Palette, 
  MessageSquare,
  Zap,
  Shield,
  Database,
  GitBranch,
  Cloud,
  Terminal,
  Globe,
  FileCode,
  Workflow,
  Search,
  Filter,
  Sparkles,
  Rocket,
  Target,
  BarChart,
  Eye,
  ArrowRight,
  CheckCircle,
  Star,
  ShieldCheck,
  Clock,
  Users,
  Award,
  TrendingUp,
  ExternalLink
} from "lucide-react";

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const services = [
    {
      id: 1,
      title: "MERN Stack Development",
      description: "Full-stack applications using MongoDB, Express, React, and Node.js. Build scalable, modern web applications with complete solutions.",
      icon: <Layers className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/20",
      features: ["RESTful APIs", "Real-time apps", "Authentication", "Database design"],
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      category: "full-stack",
      popular: true,
      level: "Expert",
      delivery: "4-8 weeks",
      price: "Custom Quote"
    },
    {
      id: 2,
      title: "Fullstack Engineering",
      description: "Complete end-to-end software solutions covering frontend, backend, database, and deployment.",
      icon: <Workflow className="w-6 h-6" />,
      color: "from-purple-600 to-indigo-600",
      gradient: "bg-gradient-to-br from-purple-600 to-indigo-600",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/20",
      features: ["End-to-end solutions", "System Architecture", "DevOps", "Scalability"],
      technologies: ["Full Stack", "DevOps", "Cloud", "Microservices"],
      category: "full-stack",
      popular: true,
      level: "Expert",
      delivery: "6-12 weeks",
      price: "Custom Quote"
    },
    {
      id: 3,
      title: "Python Development",
      description: "Python-based web applications, data analysis, automation scripts, and backend services.",
      icon: <Code className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/20",
      features: ["Django/Flask", "Data Analysis", "Automation", "APIs"],
      technologies: ["Python", "Django", "Flask", "FastAPI"],
      category: "backend",
      popular: false,
      level: "Advanced",
      delivery: "3-6 weeks",
      price: "$3,000+"
    },
    {
      id: 4,
      title: "C++ Application Development",
      description: "High-performance applications, system programming, game development, and embedded systems.",
      icon: <Cpu className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/20",
      features: ["System Programming", "Game Development", "Optimization", "Embedded"],
      technologies: ["C++", "QT", "OpenGL", "Embedded"],
      category: "specialized",
      popular: false,
      level: "Advanced",
      delivery: "4-10 weeks",
      price: "$4,000+"
    },
    {
      id: 5,
      title: "Mobile App Development",
      description: "Cross-platform and native mobile applications for iOS and Android.",
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/5",
      borderColor: "border-yellow-500/20",
      features: ["iOS & Android", "React Native", "Flutter", "App Store"],
      technologies: ["React Native", "Flutter", "iOS", "Android"],
      category: "mobile",
      popular: true,
      level: "Advanced",
      delivery: "6-12 weeks",
      price: "$5,000+"
    },
    {
      id: 6,
      title: "Website Maintenance",
      description: "Regular updates, security patches, performance optimization for your website.",
      icon: <Wrench className="w-6 h-6" />,
      color: "from-red-500 to-rose-500",
      gradient: "bg-gradient-to-br from-red-500 to-rose-500",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/20",
      features: ["Security Updates", "Performance", "Bug Fixes", "Backups"],
      technologies: ["Maintenance", "Security", "Optimization", "Support"],
      category: "services",
      popular: false,
      level: "Intermediate",
      delivery: "Ongoing",
      price: "$300/month"
    },
    {
      id: 7,
      title: "Payment Integration",
      description: "Secure payment gateway integration with global payment systems.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-500",
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500/5",
      borderColor: "border-indigo-500/20",
      features: ["Stripe", "PayPal", "Razorpay", "Secure Transactions"],
      technologies: ["Stripe", "PayPal", "Payment APIs", "Security"],
      category: "services",
      popular: true,
      level: "Expert",
      delivery: "2-4 weeks",
      price: "$1,500+"
    },
    {
      id: 8,
      title: "Backend Services",
      description: "Robust server-side solutions, API development, database management.",
      icon: <Server className="w-6 h-6" />,
      color: "from-gray-700 to-gray-900",
      gradient: "bg-gradient-to-br from-gray-700 to-gray-900",
      bgColor: "bg-gray-500/5",
      borderColor: "border-gray-500/20",
      features: ["API Development", "Database Design", "Server Management", "Security"],
      technologies: ["Node.js", "Python", "Java", "PHP"],
      category: "backend",
      popular: false,
      level: "Advanced",
      delivery: "3-8 weeks",
      price: "$2,500+"
    },
    {
      id: 9,
      title: "Frontend Development",
      description: "Modern, responsive user interfaces using React, Vue, Angular, and best practices.",
      icon: <Palette className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/5",
      borderColor: "border-pink-500/20",
      features: ["React/Vue/Angular", "Responsive Design", "UI/UX", "Performance"],
      technologies: ["React", "Vue.js", "TypeScript", "Tailwind"],
      category: "frontend",
      popular: true,
      level: "Expert",
      delivery: "3-6 weeks",
      price: "$2,000+"
    },
    {
      id: 10,
      title: "Technical Consulting",
      description: "Technical consulting, architecture reviews, and technology stack recommendations.",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "from-teal-500 to-green-500",
      gradient: "bg-gradient-to-br from-teal-500 to-green-500",
      bgColor: "bg-teal-500/5",
      borderColor: "border-teal-500/20",
      features: ["Tech Consulting", "Architecture Review", "Stack Selection", "Code Review"],
      technologies: ["Consulting", "Architecture", "Best Practices", "Planning"],
      category: "services",
      popular: false,
      level: "Expert",
      delivery: "Flexible",
      price: "$150/hour"
    },
    {
      id: 11,
      title: "Performance Optimization",
      description: "Speed optimization, load time reduction, and performance enhancement services.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-amber-500 to-yellow-500",
      gradient: "bg-gradient-to-br from-amber-500 to-yellow-500",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/20",
      features: ["Speed Optimization", "Load Testing", "Caching", "CDN Setup"],
      technologies: ["Performance", "Optimization", "Caching", "CDN"],
      category: "services",
      popular: true,
      level: "Advanced",
      delivery: "2-4 weeks",
      price: "$1,800+"
    },
    {
      id: 12,
      title: "Security Services",
      description: "Security audits, vulnerability assessment, and secure coding practices.",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "from-lime-500 to-green-500",
      gradient: "bg-gradient-to-br from-lime-500 to-green-500",
      bgColor: "bg-lime-500/5",
      borderColor: "border-lime-500/20",
      features: ["Security Audit", "Vulnerability Scan", "Secure Coding", "SSL/TLS"],
      technologies: ["Security", "Audit", "Encryption", "Compliance"],
      category: "services",
      popular: false,
      level: "Expert",
      delivery: "2-6 weeks",
      price: "$2,500+"
    },
    {
      id: 13,
      title: "Database Services",
      description: "Database design, optimization, migration, and management services.",
      icon: <Database className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/20",
      features: ["Database Design", "Optimization", "Migration", "Backup"],
      technologies: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
      category: "backend",
      popular: false,
      level: "Advanced",
      delivery: "2-6 weeks",
      price: "$1,800+"
    },
    {
      id: 14,
      title: "Version Control",
      description: "Git setup, branching strategies, CI/CD pipeline configuration.",
      icon: <GitBranch className="w-6 h-6" />,
      color: "from-fuchsia-500 to-purple-500",
      gradient: "bg-gradient-to-br from-fuchsia-500 to-purple-500",
      bgColor: "bg-fuchsia-500/5",
      borderColor: "border-fuchsia-500/20",
      features: ["Git Setup", "CI/CD", "Deployment", "Automation"],
      technologies: ["Git", "GitHub", "GitLab", "CI/CD"],
      category: "infrastructure",
      popular: false,
      level: "Intermediate",
      delivery: "1-3 weeks",
      price: "$1,200+"
    },
    {
      id: 15,
      title: "Cloud Services",
      description: "Cloud deployment, server management, and cloud infrastructure setup.",
      icon: <Cloud className="w-6 h-6" />,
      color: "from-sky-500 to-blue-500",
      gradient: "bg-gradient-to-br from-sky-500 to-blue-500",
      bgColor: "bg-sky-500/5",
      borderColor: "border-sky-500/20",
      features: ["AWS/Azure/GCP", "Deployment", "Server Setup", "Scaling"],
      technologies: ["AWS", "Azure", "Google Cloud", "Docker"],
      category: "infrastructure",
      popular: true,
      level: "Advanced",
      delivery: "3-6 weeks",
      price: "$2,500+"
    },
    {
      id: 16,
      title: "Custom Software",
      description: "Custom software solutions, enterprise applications, and business software.",
      icon: <FileCode className="w-6 h-6" />,
      color: "from-violet-500 to-purple-500",
      gradient: "bg-gradient-to-br from-violet-500 to-purple-500",
      bgColor: "bg-violet-500/5",
      borderColor: "border-violet-500/20",
      features: ["Custom Software", "Enterprise Apps", "Business Solutions", "SaaS"],
      technologies: ["Custom Development", "Enterprise", "SaaS", "Business"],
      category: "full-stack",
      popular: true,
      level: "Expert",
      delivery: "8-16 weeks",
      price: "Custom Quote"
    }
  ];

  const categories = [
    { id: "all", name: "All Services", count: services.length, icon: <Sparkles className="w-4 h-4" /> },
    { id: "full-stack", name: "Full Stack", count: services.filter(s => s.category === "full-stack").length, icon: <Layers className="w-4 h-4" /> },
    { id: "frontend", name: "Frontend", count: services.filter(s => s.category === "frontend").length, icon: <Palette className="w-4 h-4" /> },
    { id: "backend", name: "Backend", count: services.filter(s => s.category === "backend").length, icon: <Server className="w-4 h-4" /> },
    { id: "mobile", name: "Mobile", count: services.filter(s => s.category === "mobile").length, icon: <Smartphone className="w-4 h-4" /> },
    { id: "services", name: "Services", count: services.filter(s => s.category === "services").length, icon: <Wrench className="w-4 h-4" /> },
    { id: "infrastructure", name: "Infrastructure", count: services.filter(s => s.category === "infrastructure").length, icon: <Cloud className="w-4 h-4" /> },
    { id: "specialized", name: "Specialized", count: services.filter(s => s.category === "specialized").length, icon: <Cpu className="w-4 h-4" /> }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/30 mb-6">
              <Rocket className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Premium Services</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Development</span> Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              End-to-end technology solutions tailored to elevate your business. 
              From MVP development to enterprise-grade applications.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">16+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg shadow-blue-500/25'
                      : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:shadow-md backdrop-blur-sm'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No services found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`group relative overflow-hidden rounded-2xl border ${service.borderColor} transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] backdrop-blur-sm ${service.bgColor}`}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/20 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-amber-400 mr-1" />
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Popular</span>
                    </div>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${service.gradient} p-3.5 text-white mb-5 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {service.icon}
                  </div>

                  {/* Title and Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-200">
                      {service.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      service.level === 'Expert' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                      service.level === 'Advanced' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      'bg-green-500/10 text-green-600 dark:text-green-400'
                    }`}>
                      {service.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Features</h4>
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-1.5 h-1.5 rounded-full ${service.gradient} mr-3`}></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6 pt-5 border-t border-gray-200 dark:border-gray-800">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1.5 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.delivery}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {service.price}
                      </div>
                    </div>
                    <button className={`flex items-center px-4 py-2 rounded-lg ${service.gradient} text-white text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}>
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Animated Border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${service.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            ))}
          </div>
        )}

       
      </div>
    </div>
  );
};

export default ServicesPage;