// app/components/MobilesList.js
'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Mobiles from './Mobiles';

const MobilesList = () => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMobileId, setEditMobileId] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  
  const [searchParams, setSearchParams] = useState({
    search: '',
    brand: '',
    model: '',
    ram: '',
    storage: '',
    releaseDate: '',
    releaseDateStart: '',
    releaseDateEnd: '',
    createdDateStart: '',
    createdDateEnd: '',
    minViews: '',
    maxViews: '',
    minFavorites: '',
    maxFavorites: '',
    isActive: 'true',
    page: 1,
    limit: 10
  });

  const fetchMobiles = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`/api/userapi/mobiles/list?${queryString}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mobiles');
      }

      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setMobiles(result.data.mobiles);
        setPagination(result.data.pagination);
      } else {
        setMobiles([]);
        toast.error(result.message || 'Failed to load mobiles');
      }
    } catch (error) {
      console.error('Error:', error);
      setMobiles([]);
      toast.error(error.message || 'Error loading mobiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMobiles();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, page: 1 }));
  };

  const handleEdit = async (mobileId) => {
    setEditMobileId(mobileId);
    setShowModal(true);
  };

  const handleToggleActive = async (mobileId, currentStatus) => {
    try {
      const response = await fetch(`/api/userapi/mobiles/toggleActive/${mobileId}`, {
        method: 'PUT',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message);
        fetchMobiles();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleCloseModal = async () => {
    // Delay closing the modal slightly to ensure toasts are visible
    setTimeout(() => {
      setShowModal(false);
      setEditMobileId(null);
      // Fetch updated data after a brief delay
      setTimeout(() => {
        fetchMobiles();
      }, 500);
    }, 500);
  };

  const resetSearch = () => {
    setSearchParams({
      search: '',
    brand: '',
    model: '',
    ram: '',
    storage: '',
    releaseDate: '',
    releaseDateStart: '',
    releaseDateEnd: '',
    createdDateStart: '',
    createdDateEnd: '',
    minViews: '',
    maxViews: '',
    minFavorites: '',
    maxFavorites: '',
    isActive: 'true',
    page: 1,
    limit: 10
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mobile Devices</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Create Mobile Info
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow mb-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
      <input
        type="text"
        placeholder="Search by brand"
        value={searchParams.brand}
        onChange={e => setSearchParams(prev => ({ ...prev, brand: e.target.value }))}
        className="w-full p-2 border rounded"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
      <input
        type="text"
        placeholder="Search by model"
        value={searchParams.model}
        onChange={e => setSearchParams(prev => ({ ...prev, model: e.target.value }))}
        className="w-full p-2 border rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
      <input
        type="text"
        placeholder="RAM (e.g., 4GB)"
        value={searchParams.ram}
        onChange={e => setSearchParams(prev => ({ ...prev, ram: e.target.value }))}
        className="w-full p-2 border rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
      <input
        type="text"
        placeholder="Storage (e.g., 64GB)"
        value={searchParams.storage}
        onChange={e => setSearchParams(prev => ({ ...prev, storage: e.target.value }))}
        className="w-full p-2 border rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Release Date Range</label>
      <div className="flex gap-2">
        <input
          type="date"
          value={searchParams.releaseDateStart}
          onChange={e => setSearchParams(prev => ({ ...prev, releaseDateStart: e.target.value }))}
          className="w-1/2 p-2 border rounded"
        />
        <input
          type="date"
          value={searchParams.releaseDateEnd}
          onChange={e => setSearchParams(prev => ({ ...prev, releaseDateEnd: e.target.value }))}
          className="w-1/2 p-2 border rounded"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Created Date Range</label>
      <div className="flex gap-2">
        <input
          type="date"
          value={searchParams.createdDateStart}
          onChange={e => setSearchParams(prev => ({ ...prev, createdDateStart: e.target.value }))}
          className="w-1/2 p-2 border rounded"
        />
        <input
          type="date"
          value={searchParams.createdDateEnd}
          onChange={e => setSearchParams(prev => ({ ...prev, createdDateEnd: e.target.value }))}
          className="w-1/2 p-2 border rounded"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Release Status</label>
      <select
        value={searchParams.releaseDate}
        onChange={e => setSearchParams(prev => ({ ...prev, releaseDate: e.target.value }))}
        className="w-full p-2 border rounded"
      >
        <option value="">All</option>
        <option value="coming_soon">Coming Soon</option>
        <option value="released">Released</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        value={searchParams.isActive}
        onChange={e => setSearchParams(prev => ({ ...prev, isActive: e.target.value }))}
        className="w-full p-2 border rounded"
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
        <option value="">All</option>
      </select>
    </div>
  </div>

  <div className="mt-4 flex justify-end gap-2">
    <button
      type="button"
      onClick={resetSearch}
      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      Reset
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Search
    </button>
  </div>
</form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : mobiles.length > 0 ? (
        <>
          <div className="space-y-4">
            {mobiles.map(mobile => (
              <div key={mobile._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-start gap-4">
                  <img
                    src={mobile.headerImage}
                    alt={mobile.model}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold">{mobile.brand} {mobile.model}</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(mobile._id, mobile.isActive)}
                          className={`px-3 py-1 rounded text-sm ${
                            mobile.isActive 
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {mobile.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(mobile._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{mobile.seoTitle}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mobile.ramStorage?.map((rs, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {rs.ram} / {rs.storage}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="mr-4">Views: {mobile.views?.default || 0}</span>
                      <span>Favorites: {mobile.favorites?.default || 0}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <span>Release Date: {mobile.releaseDate || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {pagination.page > 1 && (
                <button
                  onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Previous
                </button>
              )}
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSearchParams(prev => ({ ...prev, page: i + 1 }))}
                  className={`px-4 py-2 rounded ${
                    pagination.page === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {pagination.page < pagination.totalPages && (
                <button
                  onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">No mobiles found</div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editMobileId ? 'Edit Mobile Info' : 'Create Mobile Info'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="p-4">
              <Mobiles 
                mobileId={editMobileId} 
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilesList;