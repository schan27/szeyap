'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, History } from 'lucide-react';
import SuggestionCard from './SuggestionCard';
import DefinitionCard from './DefinitionCard';

export default function ChatArea() {
  const [definitions, setDefinitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [showQueryPreview, setShowQueryPreview] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const chatInputRef = useRef(null);

  // Handle click outside to hide history
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatInputRef.current && !chatInputRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showHistory]);

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    setCurrentQuery(message);
    setShowQueryPreview(true);
    setShowHistory(false);
    
    // Add to search history (avoid duplicates)
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== message);
      return [message, ...filtered].slice(0, 5); // Keep only last 5 searches
    });
    
    // Simulate API call
    setTimeout(() => {
      const mockDefinitions = [
        {
          id: Date.now(),
          term: "機器 · 學習 · gei1 hei3 hok6 zaap6",
          definition: "A subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task. Machine learning algorithms build mathematical models based on training data to make predictions or decisions without being explicitly programmed to perform the task. It is widely used in applications such as email filtering, computer vision, speech recognition, and recommendation systems where it is difficult or unfeasible to develop conventional algorithms."
        },
        {
          id: Date.now() + 1,
          term: "神經 · 網絡 · san4 ging1 mong5 lok3",
          definition: "A computing system inspired by biological neural networks, consisting of interconnected nodes that process information in layers. These artificial neural networks are composed of artificial neurons or nodes, which are connected by edges. Each connection can transmit signals from one artificial neuron to another, and the artificial neuron receiving the signal can process it and signal additional artificial neurons connected to it. Neural networks are used for solving artificial intelligence problems and have found applications in various fields including pattern recognition, data analysis, and machine learning."
        },
        {
          id: Date.now() + 2,
          term: "深度 · 學習 · sam1 dou6 hok6 zaap6",
          definition: "A machine learning technique that uses neural networks with multiple layers to progressively extract higher-level features from raw input. Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning. The adjective 'deep' refers to the use of multiple layers in the network. Methods used can be either supervised, semi-supervised or unsupervised. Deep learning has been applied to fields including computer vision, speech recognition, natural language processing, machine translation, bioinformatics, drug design, medical image analysis, and board game programs."
        }
      ];
      
      setDefinitions(mockDefinitions);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestionClick = (message) => {
    handleSendMessage(message);
  };

  const suggestions = [
    {
      title: "Translate word",
      description: "Find Chinese to Jyutping translation",
      prompt: "Translate: 你好"
    },
    {
      title: "Learn pronunciation",
      description: "Get Jyutping for Chinese characters",
      prompt: "How do you pronounce 廣東話?"
    },
    {
      title: "Dictionary lookup",
      description: "Search for word definitions",
      prompt: "What does 飲茶 mean?"
    },
    {
      title: "Common phrases",
      description: "Learn everyday Cantonese expressions",
      prompt: "Common Cantonese greetings"
    },
    {
      title: "Character meaning",
      description: "Understand individual characters",
      prompt: "Meaning of 愛"
    },
    {
      title: "Tone practice",
      description: "Learn Cantonese tone patterns",
      prompt: "Cantonese tone examples"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {definitions.length === 0 && !isLoading && !showQueryPreview ? (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                <div className="w-10 h-10 bg-white rounded-lg"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
                Welcome to SzeYap
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
                Your intelligent Szeyap translator ready to help with any task
              </p>
            </div>
            
            <div className="w-full max-w-4xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  title={suggestion.title}
                  description={suggestion.description}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                />
              ))}
              </div>
            </div>
          </div>
        ) : isLoading ? (
          // Loading State
          <div className="max-w-4xl mx-auto w-full px-6 py-8">
            {showQueryPreview && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-in slide-in-from-bottom-4 duration-500">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Search results for: <span className="font-semibold">"{currentQuery}"</span>
                </p>
              </div>
            )}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Definitions Display
          <div className="max-w-4xl mx-auto w-full px-6 py-8">
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Search results for: <span className="font-semibold">"{currentQuery}"</span>
              </p>
            </div>
            <div className="space-y-4">
              {definitions.map((definition) => (
                <DefinitionCard
                  key={definition.id}
                  term={definition.term}
                  definition={definition.definition}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4" ref={chatInputRef}>
          {/* History Preview */}
          <div className={`overflow-hidden transition-all duration-300 ease-out ${
            showHistory && searchHistory.length > 0 
              ? 'max-h-40 opacity-100 mb-3' 
              : 'max-h-0 opacity-0 mb-0'
          }`}>
            <div className="p-2">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSendMessage(query);
                      setShowHistory(false);
                    }}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-full text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-500 transform hover:scale-105 transition-all duration-150 shadow-sm"
                  >
                    {query.length > 30 ? query.slice(0, 30) + '...' : query}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const message = formData.get('message');
            if (message.trim()) {
              handleSendMessage(message);
              e.target.reset();
            }
          }} className="relative">
            <div className="flex items-center bg-white dark:bg-slate-700 rounded-2xl border-2 border-slate-200 dark:border-slate-600 shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors focus-within:border-blue-400 dark:focus-within:border-blue-400">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`p-4 transition-colors ${
                  showHistory 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Show search history"
              >
                <History className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                name="message"
                placeholder="Type your message here..."
                className="flex-1 bg-transparent border-none outline-none px-2 py-4 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-lg"
                onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                autoComplete="off"
                spellCheck="false"
              />
              
              <button
                type="submit"
                className="p-4 text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl m-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
