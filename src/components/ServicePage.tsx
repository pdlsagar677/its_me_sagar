
"use client";

import React from "react";
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
  Workflow
} from "lucide-react";

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      title: "MERN Stack Development",
      description: "Full-stack applications using MongoDB, Express, React, and Node.js. Build scalable, modern web applications with complete solutions.",
      icon: <Layers className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      features: ["RESTful APIs", "Real-time apps", "Authentication", "Database design"],
      technologies: ["React", "Node.js", "MongoDB", "Express"]
    },
    {
      id: 2,
      title: "Fullstack Engineering",
      description: "Complete end-to-end software solutions covering frontend, backend, database, and deployment.",
      icon: <Workflow className="w-8 h-8" />,
      color: "from-purple-600 to-indigo-600",
      features: ["End-to-end solutions", "System Architecture", "DevOps", "Scalability"],
      technologies: ["Full Stack", "DevOps", "Cloud", "Microservices"]
    },
    {
      id: 3,
      title: "Python Development",
      description: "Python-based web applications, data analysis, automation scripts, and backend services.",
      icon: <Code className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      features: ["Django/Flask", "Data Analysis", "Automation", "APIs"],
      technologies: ["Python", "Django", "Flask", "FastAPI"]
    },
    {
      id: 4,
      title: "C++ Application Development",
      description: "High-performance applications, system programming, game development, and embedded systems.",
      icon: <Cpu className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      features: ["System Programming", "Game Development", "Optimization", "Embedded"],
      technologies: ["C++", "QT", "OpenGL", "Embedded"]
    },
    {
      id: 5,
      title: "Mobile App Development",
      description: "Cross-platform and native mobile applications for iOS and Android.",
      icon: <Smartphone className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      features: ["iOS & Android", "React Native", "Flutter", "App Store"],
      technologies: ["React Native", "Flutter", "iOS", "Android"]
    },
    {
      id: 6,
      title: "Website Maintenance",
      description: "Regular updates, security patches, performance optimization for your website.",
      icon: <Wrench className="w-8 h-8" />,
      color: "from-red-500 to-rose-500",
      features: ["Security Updates", "Performance", "Bug Fixes", "Backups"],
      technologies: ["Maintenance", "Security", "Optimization", "Support"]
    },
    {
      id: 7,
      title: "Payment Integration",
      description: "Secure payment gateway integration with global payment systems.",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-indigo-500 to-blue-500",
      features: ["Stripe", "PayPal", "Razorpay", "Secure Transactions"],
      technologies: ["Stripe", "PayPal", "Payment APIs", "Security"]
    },
    {
      id: 8,
      title: "Backend Services",
      description: "Robust server-side solutions, API development, database management.",
      icon: <Server className="w-8 h-8" />,
      color: "from-gray-700 to-gray-900",
      features: ["API Development", "Database Design", "Server Management", "Security"],
      technologies: ["Node.js", "Python", "Java", "PHP"]
    },
    {
      id: 9,
      title: "Frontend Development",
      description: "Modern, responsive user interfaces using React, Vue, Angular, and best practices.",
      icon: <Palette className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      features: ["React/Vue/Angular", "Responsive Design", "UI/UX", "Performance"],
      technologies: ["React", "Vue.js", "TypeScript", "Tailwind"]
    },
    {
      id: 10,
      title: "Technical Inquiry",
      description: "Technical consulting, architecture reviews, and technology stack recommendations.",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-teal-500 to-green-500",
      features: ["Tech Consulting", "Architecture Review", "Stack Selection", "Code Review"],
      technologies: ["Consulting", "Architecture", "Best Practices", "Planning"]
    },
    {
      id: 11,
      title: "Performance Optimization",
      description: "Speed optimization, load time reduction, and performance enhancement services.",
      icon: <Zap className="w-8 h-8" />,
      color: "from-amber-500 to-yellow-500",
      features: ["Speed Optimization", "Load Testing", "Caching", "CDN Setup"],
      technologies: ["Performance", "Optimization", "Caching", "CDN"]
    },
    {
      id: 12,
      title: "Security Services",
      description: "Security audits, vulnerability assessment, and secure coding practices.",
      icon: <Shield className="w-8 h-8" />,
      color: "from-lime-500 to-green-500",
      features: ["Security Audit", "Vulnerability Scan", "Secure Coding", "SSL/TLS"],
      technologies: ["Security", "Audit", "Encryption", "Compliance"]
    },
    {
      id: 13,
      title: "Database Services",
      description: "Database design, optimization, migration, and management services.",
      icon: <Database className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
      features: ["Database Design", "Optimization", "Migration", "Backup"],
      technologies: ["MongoDB", "PostgreSQL", "MySQL", "Redis"]
    },
    {
      id: 14,
      title: "Version Control",
      description: "Git setup, branching strategies, CI/CD pipeline configuration.",
      icon: <GitBranch className="w-8 h-8" />,
      color: "from-fuchsia-500 to-purple-500",
      features: ["Git Setup", "CI/CD", "Deployment", "Automation"],
      technologies: ["Git", "GitHub", "GitLab", "CI/CD"]
    },
    {
      id: 15,
      title: "Cloud Services",
      description: "Cloud deployment, server management, and cloud infrastructure setup.",
      icon: <Cloud className="w-8 h-8" />,
      color: "from-sky-500 to-blue-500",
      features: ["AWS/Azure/GCP", "Deployment", "Server Setup", "Scaling"],
      technologies: ["AWS", "Azure", "Google Cloud", "Docker"]
    },
    {
      id: 16,
      title: "Software Development",
      description: "Custom software solutions, enterprise applications, and business software.",
      icon: <FileCode className="w-8 h-8" />,
      color: "from-violet-500 to-purple-500",
      features: ["Custom Software", "Enterprise Apps", "Business Solutions", "SaaS"],
      technologies: ["Custom Development", "Enterprise", "SaaS", "Business"]
    }
  ];

  const categories = [
    { name: "Full Stack", count: 4, color: "bg-blue-100 text-blue-800" },
    { name: "Backend", count: 3, color: "bg-green-100 text-green-800" },
    { name: "Frontend", count: 2, color: "bg-pink-100 text-pink-800" },
    { name: "Mobile", count: 1, color: "bg-yellow-100 text-yellow-800" },
    { name: "Infrastructure", count: 3, color: "bg-purple-100 text-purple-800" },
    { name: "Services", count: 3, color: "bg-indigo-100 text-indigo-800" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive technology solutions tailored to your business needs. 
              From full-stack development to infrastructure management.
            </p>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <span
                  key={category.name}
                  className={`px-4 py-2 rounded-full font-medium ${category.color}`}
                >
                  {category.name} ({category.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Icon Badge */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-all duration-300`}></div>
              
              <div className="relative p-6">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-3 text-white mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color} mr-2`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

      

        
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          All services include consultation, planning, development, testing, and deployment.
          Contact us for detailed proposals and pricing.
        </p>
      </div>
    </div>
  );
};

export default ServicesPage;