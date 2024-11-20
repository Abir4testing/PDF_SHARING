'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FileText, Search, Upload, ArrowRight, Shield, Clock, Users } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative py-20 text-center"
        >
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl" />
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6"
          >
            Share PDFs Securely
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Experience the future of document sharing with our secure, efficient, and user-friendly platform. 
            Upload, manage, and share your PDFs with confidence.
          </motion.p>
        </motion.div>

        {/* Featured Images */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12"
        >
          <motion.div 
            variants={itemVariants}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform"
          >
            <Image
              src="/photo/1st.jpg"
              alt="PDF Sharing Platform"
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h3 className="text-2xl font-bold text-white">Secure Document Management</h3>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform"
          >
            <Image
              src="/photo/2nd.jpg"
              alt="PDF Organization"
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h3 className="text-2xl font-bold text-white">Effortless Organization</h3>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Link href="/upload" className="block">
              <div className="relative p-8 h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-blue-100 dark:border-blue-900">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Admin Upload</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Securely upload PDFs and assign them to unique usernames. Perfect for document management and distribution.
                  </p>
                  <div className="flex items-center text-blue-500 dark:text-blue-400 group-hover:translate-x-2 transition-transform">
                    <span className="font-medium">Get Started</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Link href="/search" className="block">
              <div className="relative p-8 h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-purple-100 dark:border-purple-900">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">User Search</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Quickly find and access PDFs using your unique username. Simple and efficient document retrieval.
                  </p>
                  <div className="flex items-center text-purple-500 dark:text-purple-400 group-hover:translate-x-2 transition-transform">
                    <span className="font-medium">Search Now</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-12"
          >
            Why Choose Our PDF Sharing Platform?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-10 -mt-10" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Secure Sharing",
    description: "Your documents are protected with unique username-based access control and enterprise-grade encryption.",
    icon: <Shield className="w-6 h-6 text-white" />
  },
  {
    title: "Real-time Access",
    description: "Instant access to your documents with our high-performance search and delivery system.",
    icon: <Clock className="w-6 h-6 text-white" />
  },
  {
    title: "Team Collaboration",
    description: "Share documents with team members efficiently while maintaining complete access control.",
    icon: <Users className="w-6 h-6 text-white" />
  }
];
