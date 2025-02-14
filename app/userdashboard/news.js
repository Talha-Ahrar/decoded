'use client';
import { useState } from 'react';

export default function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', content: '' });

  const handleAddNews = () => {
    if (newNews.title && newNews.content) {
      setNewsItems([...newsItems, { ...newNews, id: Date.now() }]);
      setNewNews({ title: '', content: '' });
    }
  };

  const handleDeleteNews = (id) => {
    setNewsItems(newsItems.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Add News</h2>
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="News Title" 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newNews.title}
            onChange={(e) => setNewNews({...newNews, title: e.target.value})}
          />
          <textarea 
            placeholder="News Content" 
            className="w-full px-3 py-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newNews.content}
            onChange={(e) => setNewNews({...newNews, content: e.target.value})}
          />
          <button 
            onClick={handleAddNews}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add News
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">News List</h2>
        {newsItems.map((item) => (
          <div key={item.id} className="border-b py-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600">{item.content}</p>
            </div>
            <button 
              onClick={() => handleDeleteNews(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}