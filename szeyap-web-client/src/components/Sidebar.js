'use client';

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import SidebarButton from './SidebarButton';
import { Search, Library, Sun, Moon, Mail, Lock, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [chats] = useState([
    'Next.js vs React.js',
    'Chiang Mai Internship Safety ...',
    'Constructing Date in JS',
    'ExclusiveStartKey with Timest...',
    'Building ExclusiveStartKey in ...',
    'Construct ExclusiveStartKey',
    'Iterating and Modifying Lists',
    'Decimal to Int Conversion',
    'Constructing LastEvaluatedKey',
    'Using ExclusiveStartKey in Bo...',
    'Download S3 Bucket AWS CLI',
    'DynamoDB Python Wrapper'
  ]);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    setError('');
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="w-72 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white flex flex-col h-screen border-r border-slate-200 dark:border-slate-700/50">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">SzeYap</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Szeyap Translator</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex flex-col justify-center p-6">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome Back</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to access your Szeyap translator</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Demo: Use any email and password to login
            </p>
          </div>
        </div>

        {/* Theme Switcher - Always Available */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
          <SidebarButton 
            onClick={handleThemeToggle}
            icon={theme === 'dark' ? Sun : Moon}
            className="hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
          </SidebarButton>
        </div>
      </div>
    );
  }

  // Authenticated Sidebar
  return (
    <div className="w-72 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white flex flex-col h-screen border-r border-slate-200 dark:border-slate-700/50">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>            <div className="flex flex-col">
              <div className="bg-transparent text-slate-900 dark:text-white text-lg font-bold border-none outline-none cursor-pointer">
                SzeYap
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Szeyap Translator</span>
            </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Quick Actions</div>
          <SidebarButton 
            icon={Search}
          >
            Search Conversations
          </SidebarButton>
          <SidebarButton 
            icon={Library}
          >
            Knowledge Base
          </SidebarButton>
        </div>

        {/* Chat History */}
        <div className="mt-8">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Recent Chats</div>
          <div className="space-y-1">
            {chats.map((chat, index) => (
              <SidebarButton
                key={index}
                variant="small"
                className="truncate hover:bg-slate-100 dark:hover:bg-slate-700/50"
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                {chat}
              </SidebarButton>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30 space-y-2">
        {/* User Profile */}
        <div className="mb-4 p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 dark:text-white truncate">{user.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Theme Switcher */}
        <SidebarButton 
          onClick={handleThemeToggle}
          icon={theme === 'dark' ? Sun : Moon}
          className="hover:bg-slate-100 dark:hover:bg-slate-700/50"
        >
          {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
        </SidebarButton>
        
        {/* Logout Button */}
        <SidebarButton 
          onClick={handleLogout}
          icon={LogOut}
          className="hover:bg-red-50 dark:hover:bg-red-600/20 hover:text-red-600 dark:hover:text-red-300"
        >
          Sign Out
        </SidebarButton>

      </div>
    </div>
  );
}
