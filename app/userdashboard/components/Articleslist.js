import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    viewsMin: '',
    viewsMax: '',
    isFavorite: false,
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);
  const notifyLoading = (message) => toast.loading(message);

  const fetchArticles = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.viewsMin && { viewsMin: filters.viewsMin }),
        ...(filters.viewsMax && { viewsMax: filters.viewsMax }),
        ...(filters.isFavorite && { isFavorite: filters.isFavorite }),
      });

      const response = await fetch(`/api/userapi/articles/my-articles?${queryParams}`);
      const data = await response.json();
      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setTotalPages(Math.ceil(data.total / filters.limit));
    } catch (error) {
      console.error('Error fetching articles:', error);
      notifyError('Failed to fetch articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    const toastId = notifyLoading('Deleting article...');
    try {
      const response = await fetch(`/api/userapi/articles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchArticles();
        toast.dismiss(toastId);
        notifySuccess('Article deleted successfully');
      } else {
        throw new Error('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.dismiss(toastId);
      notifyError('Failed to delete article. Please try again.');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    const toastId = notifyLoading('Updating status...');
    try {
      const response = await fetch(`/api/userapi/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchArticles();
        toast.dismiss(toastId);
        notifySuccess(`Article ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error('Failed to update article status');
      }
    } catch (error) {
      console.error('Error updating article status:', error);
      toast.dismiss(toastId);
      notifyError('Failed to update article status. Please try again.');
    }
  };

  const ViewDialog = ({ article, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{article.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose max-w-none" />
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6">My Articles</h2>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search articles..."
          className="border rounded px-3 py-2"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
        />
        <select
          className="border rounded px-3 py-2"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min views"
            className="border rounded px-3 py-2 w-1/2"
            value={filters.viewsMin}
            onChange={(e) => setFilters(prev => ({ ...prev, viewsMin: e.target.value, page: 1 }))}
          />
          <input
            type="number"
            placeholder="Max views"
            className="border rounded px-3 py-2 w-1/2"
            value={filters.viewsMax}
            onChange={(e) => setFilters(prev => ({ ...prev, viewsMax: e.target.value, page: 1 }))}
          />
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isFavorite}
            onChange={(e) => setFilters(prev => ({ ...prev, isFavorite: e.target.checked, page: 1 }))}
            className="mr-2"
          />
          Favorites only
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{article.title || 'Untitled'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{article.contentType || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{article.views?.default || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      article.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {article.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedArticle(article);
                      setShowViewDialog(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => window.location.href = `/articles/edit/${article._id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(article._id, article.isActive)}
                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                  >
                    Toggle Status
                  </button>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          disabled={filters.page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {filters.page} of {totalPages}
        </span>
        <button
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          disabled={filters.page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* View Dialog */}
      {showViewDialog && selectedArticle && (
        <ViewDialog
          article={selectedArticle}
          onClose={() => {
            setShowViewDialog(false);
            setSelectedArticle(null);
          }}
        />
      )}
    </div>
  );
}