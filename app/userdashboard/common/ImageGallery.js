import React, { useState, useEffect } from 'react';
import { ImageIcon, X } from 'lucide-react';

const ImageGallery = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/userapi/images-gallery', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch images (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      if (!data.images || !Array.isArray(data.images)) {
        throw new Error('Invalid response format');
      }

      // Filter and validate images
      const validImages = data.images.filter(img => (
        img?.url && 
        img?.id && 
        img?.name && 
        typeof img.url === 'string'
      ));

      setImages(validImages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, retryCount]);

  if (!isOpen) return null;

  const handleSelectImage = (image) => {
    onSelect(image);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Image Gallery</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex flex-col items-center">
                <p className="text-red-800 mb-2">{error}</p>
                <button 
                  onClick={handleRetry}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-8">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No images available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => handleSelectImage(image)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select image: ${image.name}`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/api/placeholder/200/200';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-90">
                    <p className="text-sm truncate">{image.name}</p>
                    {image.dateUploaded && (
                      <p className="text-xs text-gray-500">
                        {new Date(image.dateUploaded).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;