import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check } from 'lucide-react';

const NotificationDropdown = ({ isOpen, notifications = [], onMarkAsRead, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed sm:absolute right-0 sm:right-0 top-16 sm:top-auto sm:mt-2 w-full sm:w-96 z-50">
      <div className="bg-white shadow-lg overflow-hidden h-[calc(100vh-4rem)] sm:h-auto sm:max-h-[80vh] sm:rounded-lg sm:border mx-auto sm:mx-0">
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full sm:max-h-[60vh]">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 p-4">No notifications</p>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg border mb-2 ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="ml-2 p-1 hover:bg-blue-100 rounded-full"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminNotificationForm = ({ onSendNotification }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && message) {
      onSendNotification({ title, message });
      setTitle('');
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:relative sm:mt-4 bg-white p-4 border-t sm:border sm:rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <h3 className="text-lg font-semibold">Send Notification</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
        >
          Send Notification
        </button>
      </form>
    </div>
  );
};

const bellKeyframes = `
  @keyframes bellRing {
    0% { transform: rotate(0); }
    20% { transform: rotate(15deg); }
    40% { transform: rotate(-15deg); }
    60% { transform: rotate(7deg); }
    80% { transform: rotate(-7deg); }
    100% { transform: rotate(0); }
  }
`;

const NotificationBell = ({ count, onClick, hasNewNotification }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
    >
      <style>{bellKeyframes}</style>
      <Bell 
        className={`w-6 h-6 ${hasNewNotification ? 'animate-[bellRing_1s_ease-in-out]' : ''}`} 
      />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

const NotificationContainer = ({ isAdmin }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close notifications when scrolling on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 640 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleSendNotification = ({ title, message }) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
    setHasNewNotification(true);
    setTimeout(() => setHasNewNotification(false), 1000);
  };

  // Prevent body scroll when notifications are open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <NotificationBell
        count={unreadCount}
        onClick={() => setIsOpen(!isOpen)}
        hasNewNotification={hasNewNotification}
      />
      
      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />

      {isAdmin && isOpen && (
        <AdminNotificationForm onSendNotification={handleSendNotification} />
      )}
    </div>
  );
};

export default NotificationContainer;