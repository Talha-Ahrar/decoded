'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem('admin_auth_data');
        if (!userData) {
          toast.error('User data not found');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFullName(parsedUser.FullName || '');

        const response = await fetch('/api/userapi/settings', {
          headers: {
            'Authorization': `Bearer ${parsedUser.userId}`
          }
        });

        if (response.ok) {
          const freshData = await response.json();
          setUser(prev => ({ ...prev, ...freshData }));
          setFullName(freshData.FullName || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateName = async () => {
    if (!fullName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/userapi/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          FullName: fullName
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        if (data.user) {
          const updatedStorageData = { ...user, ...data.user };
          localStorage.setItem('admin_auth_data', JSON.stringify(updatedStorageData));
          setUser(updatedStorageData);
        }
        setEditingName(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/userapi/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          oldPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setChangingPassword(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-blue-600">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-blue-100 mt-1">Manage your account information and security</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Profile Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            
                {!editingName && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid gap-6 bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                <div>   <p className="text-sm text-gray-500">Full name</p>
                <p className="mt-1 font-medium">{user.FullName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="mt-1 font-medium">{user.username}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="mt-1 font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Access Routes</p>
                    <p className="mt-1 font-medium">{user.routes.join(', ')}</p>
                  </div>
                </div>

                {editingName && (
                  <div className="mt-4 border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-2 flex gap-3">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      <button
                        onClick={handleUpdateName}
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {updating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingName(false);
                          setFullName(user.FullName || '');
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                {!changingPassword && (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {changingPassword && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleUpdatePassword}
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {updating ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        onClick={() => {
                          setChangingPassword(false);
                          setOldPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}