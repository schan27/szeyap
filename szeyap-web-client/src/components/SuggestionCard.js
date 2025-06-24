'use client';

import { ArrowRight } from 'lucide-react';

export default function SuggestionCard({ 
  title, 
  description, 
  onClick,
  className = "" 
}) {
  return (
    <button 
      onClick={onClick}
      className={`group relative p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg text-left hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-blue-200/50 dark:border-blue-700/30 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md transform hover:-translate-y-1 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1 text-sm">
            {title}
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
            {description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2 mt-0.5" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
    </button>
  );
}
