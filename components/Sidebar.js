'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Smartphone, X, Search, Newspaper, Book, Laptop } from 'lucide-react';
import { useSidebar } from './SidebarContext';

// Virtualized list component
function VirtualizedList({ items, onItemClick }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    const itemHeight = 36;
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(clientHeight / itemHeight) + 10, items.length);
    setVisibleRange({ start, end });
  };

  return (
    <div 
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      onScroll={handleScroll}
    >
      <div className="py-1" style={{ height: `${items.length * 36}px`, position: 'relative' }}>
        {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
          <Link
            key={item.id}
            href={`/${item.type}/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onItemClick?.(item)}
            className="absolute flex items-center px-3 py-1.5 text-sm text-white/90 hover:bg-white/20 hover:text-white transition-all duration-200 w-full"
            style={{ top: `${(index + visibleRange.start) * 36}px` }}
          >
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({ isMobile }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, sidebarType, closeSidebar } = useSidebar();

  // Fetch items based on sidebarType
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const cacheKey = `sidebar_items_${sidebarType}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          setItems(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/ClientApi/openapi/getcat_menu?type=${sidebarType}`,
          { signal: controller.signal }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setItems(data.data);
          sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
        } else {
          throw new Error(data.message || 'Failed to fetch items');
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching items:', error);
        setError('Failed to load items. Please try again later.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (sidebarType) {
      fetchItems();
    }

    return () => controller.abort();
  }, [sidebarType]);

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Memoized title config
  const titleConfig = useMemo(() => ({
    mobile: { text: 'Mobile Brands', icon: Smartphone },
    gadget: { text: 'Gadget Categories', icon: Laptop },
    news: { text: 'News Categories', icon: Newspaper },
    article: { text: 'Article Categories', icon: Book }
  })[sidebarType] || { text: 'Mobile Brands', icon: Smartphone }, [sidebarType]);

  const TitleIcon = titleConfig.icon;

  return (
    <aside
      className={`fixed top-[96px] h-[calc(100vh-96px)] bg-gradient-to-b from-blue-600 to-purple-600 shadow-xl
        ${isMobile ? 'w-56 transform transition-transform duration-300 ease-in-out z-30' : 'w-56'}
        ${isOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : '-translate-x-56'}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-white/20 backdrop-blur-sm flex justify-between items-center">
          <h2 className="text-sm font-medium text-white flex items-center gap-2">
            <TitleIcon className="w-4 h-4" />
            {titleConfig.text}
          </h2>
          {isMobile && (
            <button
              onClick={closeSidebar}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-3 border-b border-white/20">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${titleConfig.text.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-white/50 text-sm rounded-md px-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
        </div>

        {loading ? (
          <div className="p-3 text-white/70 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-2"></div>
            <div className="h-6 bg-white/20 rounded mb-2"></div>
            <div className="h-6 bg-white/20 rounded"></div>
          </div>
        ) : error ? (
          <div className="p-3 text-red-200 text-sm">{error}</div>
        ) : (
          <VirtualizedList 
            items={filteredItems.map(item => ({ ...item, type: sidebarType }))} 
            onItemClick={isMobile ? closeSidebar : undefined}
          />
        )}

        <div className="p-3 border-t border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="text-xs text-white/90">
            <p>Total {titleConfig.text}: {filteredItems.length}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}