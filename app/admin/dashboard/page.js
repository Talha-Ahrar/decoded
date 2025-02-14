// app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthGuard from './components/AuthGuard';
// import Overview from './components/Overview';
import CreateUser from './CreateUser';
import Settings from './AccountSettings';
import SuperUserManagement from './SuperUserManagement';
import MobileBrandManagement from './MobileBrands'
import NewsCategoryManagement from './NewsCategoryManagement';
import ArticleCategories from './ArticleCategories';


import GadgetCategoryManagement from './GadgetCategoryManagement';
export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    recentActivities: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (activeComponent === 'overview') {
      fetchStats();
    }
  }, [activeComponent]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'create-user':
        return <CreateUser />;
      case 'create-admin':
        return <SuperUserManagement role="admin" />;
      case 'create-editor':
        return <SuperUserManagement role="editor" />;

        case 'gadget-category':
          return <GadgetCategoryManagement role="editor" />;

          case 'article-category':
            return <ArticleCategories role="editor" />;


        case 'news-category':
          return <NewsCategoryManagement role="editor" />;
        case 'brand-name':
          return <MobileBrandManagement role="editor" />;
      case 'settings':
        return <Settings />;
      case 'overview':
        return (
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center p-6">
            <h2 className="text-xl font-semibold">Select an option from the sidebar</h2>
          </div>
        );
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar 
            setActiveComponent={setActiveComponent} 
            activeComponent={activeComponent} 
          />
          <main className="flex-1 p-6 lg:ml-64">
            {renderComponent()}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}