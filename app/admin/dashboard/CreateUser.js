'use client';

import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
// UserList Component
function UserList({ onEdit, onRefresh }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
  
    const fetchUsers = async () => {
        try {
          const response = await fetch('/api/dashboard/users/list', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setUsers(data.users);
            setFilteredUsers(data.users);
            toast.success('Users fetched successfully', { id: 'usersFetched' });
          } else {
            setError(data.error);
            toast.error(data.error || 'Failed to fetch users', { id: 'usersFetchError' });
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setError('Failed to fetch users');
          toast.error('Failed to fetch users', { id: 'usersFetchError' });
        } finally {
          setLoading(false);
        }
      };
      
  
    useEffect(() => {
      fetchUsers();
    }, [onRefresh]);
  
    // Search and filter logic
    useEffect(() => {
      const results = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
      setCurrentPage(1);
    }, [searchTerm, users]);
  
    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-600 py-4">{error}</div>;
  
    return (
      <div>
        {/* Search Input */}
        <br></br>
        <br></br>

        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Full Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Routes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{user.username}</td>
                  <td className="px-6 py-4 text-sm">{user.FullName}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {user.routes.map(route => (
                        <span key={route} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {route}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded ${
                currentPage === 1 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === number + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
              className={`px-4 py-2 border rounded ${
                currentPage === Math.ceil(filteredUsers.length / usersPerPage)
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

// UserForm Component
function UserForm({ user = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    FullName: user?.FullName || '',
    email: user?.email || '',
    password: '',
    isActive: user?.isActive ?? true,
    routes: user?.routes || [],
  });
  const [loading, setLoading] = useState(false);

  const availableRoutes = [
    { id: 'news', label: 'News' },
    { id: 'articles', label: 'Articles' },
    { id: 'gadget', label: 'Gadget' },
    { id: 'mobiles', label: 'Mobiles Info' }
  ];

  const handleRouteChange = (routeId) => {
    setFormData(prev => ({
      ...prev,
      routes: prev.routes.includes(routeId)
        ? prev.routes.filter(id => id !== routeId)
        : [...prev.routes, routeId]
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.FullName.trim()) return 'Full Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!user && !formData.password) return 'Password is required for new users';
    if (formData.routes.length === 0) return 'At least one route must be selected';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const endpoint = user 
        ? `/api/dashboard/users/update/${user._id}`
        : '/api/dashboard/users/create';
      
      const response = await fetch(endpoint, {
        method: user ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`User ${user ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          onSubmit();
        }, 1500);
      } else {
        toast.error(data.error || `Failed to ${user ? 'update' : 'create'} user`);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(`Failed to ${user ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{user ? 'Update' : 'Create'} User</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.FullName}
            onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password {user && '(Leave blank to keep current password)'}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Route Permissions</label>
          <div className="space-y-2">
            {availableRoutes.map(route => (
              <div key={route.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={route.id}
                  checked={formData.routes.includes(route.id)}
                  onChange={() => handleRouteChange(route.id)}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor={route.id}>{route.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 text-white rounded focus:ring-2 focus:ring-offset-2 ${
              loading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Processing...' : `${user ? 'Update' : 'Create'} User`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Main UserManagement Component
export default function UserManagement() {
  const [view, setView] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setView('edit');
  };

  const handleSubmitSuccess = () => {
    setView('list');
    setSelectedUser(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#4caf50',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#f44336',
              color: 'white',
            },
          },
        }}
      />
      <br></br><br></br>
      <div className="flex justify-between items-center mb-6">
        
        <h1 className="text-3xl font-bold">User Management</h1>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create New User
          </button>
        )}
      </div>

      {view === 'list' && (
        <UserList onEdit={handleEdit} onRefresh={refreshTrigger} />
      )}

      {(view === 'create' || view === 'edit') && (
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmitSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}