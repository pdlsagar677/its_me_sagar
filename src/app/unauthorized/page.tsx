"use client";

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-3">
          Access Denied
        </h1>
        
        <p className="text-gray-400 mb-8">
          You don't have permission to access the admin dashboard. 
          This area is restricted to administrators only.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Portfolio
          </Link>
          
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-white font-medium rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go to Login
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          If you believe this is an error, please contact the system administrator.
        </p>
      </div>
    </div>
  );
}