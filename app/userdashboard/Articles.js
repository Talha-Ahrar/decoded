import React, { useState } from 'react';
import Articlelist from './components/Articleslist';
import ArticleForm from './components/ArticleForm';
import { Plus, X } from 'lucide-react';

const Articles = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Articles</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showCreateForm ? (
            <>
              <X size={20} />
              Close Form
            </>
          ) : (
            <>
              <Plus size={20} />
              Create Article
            </>
          )}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <ArticleForm />
        </div>
      )}

      <div className={`transition-all duration-300 ${showCreateForm ? 'opacity-50' : 'opacity-100'}`}>
        <Articlelist />
      </div>
    </div>
  );
};

export default Articles;