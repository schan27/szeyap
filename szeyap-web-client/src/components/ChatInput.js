'use client';

import { useState } from 'react';
import { Plus, Send } from 'lucide-react';

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">            <button
              type="button"
              className="p-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything"
              className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
