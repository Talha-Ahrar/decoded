import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UserPlus, 
  Edit, 
  User,
  Smartphone,
  Newspaper,
  FileText,
  Laptop,
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ setActiveComponent, activeComponent }) {
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      submenu: [
        {
          id: 'create-admin',
          label: 'Create Admin',
          icon: <UserPlus className="w-4 h-4" />
        },
        {
          id: 'create-editor',
          label: 'Create Editor',
          icon: <Edit className="w-4 h-4" />
        },
        {
          id: 'create-user',
          label: 'Create User',
          icon: <User className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'Mobiles',
      label: 'Mobiles',
      icon: <Smartphone className="w-5 h-5" />,
      submenu: [
        {
          id: 'brand-name',
          label: 'Brand Name',
          icon: <Smartphone className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'News',
      label: 'News',
      icon: <Newspaper className="w-5 h-5" />,
      submenu: [
        {
          id: 'news-category',
          label: 'News Category',
          icon: <Newspaper className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'Article',
      label: 'Article',
      icon: <FileText className="w-5 h-5" />,
      submenu: [
        {
          id: 'article-category',
          label: 'Article Category',
          icon: <FileText className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'Gadget',
      label: 'Gadget',
      icon: <Laptop className="w-5 h-5" />,
      submenu: [
        {
          id: 'gadget-category',
          label: 'Gadget Category',
          icon: <Laptop className="w-4 h-4" />
        }
      ]
    }
  ];

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => item.submenu ? toggleSubmenu(item.id) : setActiveComponent(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeComponent === item.id || (item.submenu && item.submenu.some(sub => sub.id === activeComponent))
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 ${
                    activeComponent === item.id
                      ? 'text-blue-700'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                {item.submenu && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    expandedMenus[item.id] ? 'transform rotate-180' : ''
                  }`} />
                )}
              </button>
              
              {item.submenu && expandedMenus[item.id] && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveComponent(subItem.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeComponent === subItem.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`mr-3 ${
                        activeComponent === subItem.id
                          ? 'text-blue-700'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}>
                        {subItem.icon}
                      </span>
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}