'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import News from './news';
import Articles from './Articles';
import Gadget from './Gadget';
import MobilesList from './mobiles/MobilesList';
import SettingsPage from './SettingsPage';
const LOCAL_STORAGE_KEY = 'admin_auth_data';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [selectedPage, setSelectedPage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const userData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!userData) {
        router.push('/userlogin');
      } else {
        setUser(JSON.parse(userData));
      }
  
      const handleResize = () => {
        const newIsMobile = window.innerWidth < 768;
        if (newIsMobile !== isMobile) {
          setIsMobile(newIsMobile);
          setIsSidebarOpen(!newIsMobile);
        }
      };
  
      const initialIsMobile = window.innerWidth < 768;
      setIsMobile(initialIsMobile);
      setIsSidebarOpen(!initialIsMobile);
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [router, isMobile]);
  
    const handleLogout = () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      router.push('/userlogin');
    };
  
    if (!user) return null;
  
    const routes = [...user.routes, 'settings']; // Add "settings" to the routes array
  
    const renderPage = () => {
      switch (selectedPage) {
        case 'news':
          return <News />;
        case 'articles':
          return <Articles />;
        case 'gadget':
          return <Gadget />;
        case 'mobiles':
          return <MobilesList />;
        case 'settings':
          return <SettingsPage />; // Show the Settings Page here
        default:
          return (
            <div className="flex items-center justify-center h-[calc(100vh-5rem)] bg-gray-50">
              <div className="text-center p-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Dashboard</h1>
                <p className="text-gray-500">Select a section from the sidebar to begin</p>
              </div>
            </div>
          );
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
  
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          routes={routes} // Pass the updated routes array
        />
  
        {/* Main content */}
        <div className={`transition-all duration-300 ${isSidebarOpen && !isMobile ? 'md:ml-64' : ''}`}>
          <Navbar 
            onLogout={handleLogout} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="p-4 md:p-6">
            {renderPage()}
          </main>
          <Footer />
        </div>
      </div>
    );
  }
  

function Sidebar({ isOpen, isMobile, selectedPage, setSelectedPage, routes }) {
    const getButtonClass = (page) => 
      `w-full flex items-center px-4 py-2.5 rounded-lg transition-colors ${
        selectedPage === page 
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`;
  
    const getIcon = (page) => {
      const iconClass = "w-5 h-5 mr-3";
      switch(page) {
        case 'news':
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          );
        case 'articles':
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          );
        case 'gadget':
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          );
        case 'mobiles':
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          );
        case 'settings': // Add the icon for the "Settings" page
          return (
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 0V3m0 5V3m0 0h5m-5 0H7m5 5h.01M17 16a4 4 0 00-4-4h-4a4 4 0 00-4 4v4a4 4 0 004 4h4a4 4 0 004-4v-4zm-4 1h-4a1 1 0 010-2h4a1 1 0 010 2z" />
            </svg>
          );
      }
    };
  
    return (
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r transition-transform duration-300 z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-lg font-semibold">Admin Panel</span>
            </div>
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {routes.map(route => (
              <button
                key={route}
                onClick={() => setSelectedPage(route)}
                className={getButtonClass(route)}
              >
                {getIcon(route)}
                <span className="text-sm font-medium capitalize">{route}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    );
  }
  
function Navbar({ onLogout, toggleSidebar }) {
  return (
    <nav className="sticky top-0 bg-white border-b z-10">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-medium text-gray-800">Dashboard</span>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

function Footer() {
    return (
      <footer className="border-t bg-white mt-auto">
        <div className="px-4 py-3 text-center text-sm text-gray-500">
          © 2025 Admin Dashboard. All rights reserved. Developed by{' '}
          <a
            href="https://betapixelstudio.com/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            BetaPixel Studio
          </a>
          .
        </div>
      </footer>
    );
  }