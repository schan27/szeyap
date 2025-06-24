'use client';

import { useState, useRef, useEffect } from 'react';

export default function DefinitionCard({ term, definition }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [contentHeight, setContentHeight] = useState('auto');
  const contentRef = useRef(null);
  const previewRef = useRef(null);
  
  // Show preview of first ~100 characters
  const previewText = definition.length > 100 
    ? definition.slice(0, 100) + "..."
    : definition;

  useEffect(() => {
    if (contentRef.current && previewRef.current) {
      if (isExpanded) {
        // When expanding: show full content immediately, then animate height
        setShowFullContent(true);
        setContentHeight(contentRef.current.scrollHeight + 'px');
      } else {
        // When collapsing: animate height first, then hide full content after delay
        setContentHeight(previewRef.current.scrollHeight + 'px');
        const timeout = setTimeout(() => {
          setShowFullContent(false);
        }, 500); // Match the height animation duration
        
        return () => clearTimeout(timeout);
      }
    }
  }, [isExpanded]);

  const handleClick = () => {
    if (definition.length > 100) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 ${
        definition.length > 100 
          ? 'cursor-pointer hover:shadow-lg hover:scale-[1.01] hover:border-blue-300 dark:hover:border-blue-500' 
          : 'hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
        {term}
      </h3>
      
      <div className="relative overflow-hidden">
        <div 
          className="transition-all duration-500 ease-in-out"
          style={{ height: contentHeight }}
        >
          <div className={`${!showFullContent ? 'opacity-100' : 'opacity-0 absolute'} transition-opacity duration-300`}>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {previewText}
            </p>
          </div>
          
          <div ref={contentRef} className={`${showFullContent ? 'opacity-100' : 'opacity-0 absolute'} transition-opacity duration-300`}>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {definition}
            </p>
          </div>
          
          <div ref={previewRef} className="opacity-0 absolute pointer-events-none">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {previewText}
            </p>
          </div>
        </div>
        
        {!isExpanded && definition.length > 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none transition-opacity duration-300"></div>
        )}
      </div>
    </div>
  );
}
