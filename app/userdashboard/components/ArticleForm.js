import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import toast, { Toaster } from 'react-hot-toast';
import { X } from 'lucide-react';
 import { ImageIcon } from 'lucide-react';
import ImageGallery from '../common/ImageGallery'

export default function ArticleForm() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    contentType: '',
    headerImage: '',
    seoTitle: '',
    metaDescription: '',
    isActive: true,
    tags: [],
  });
  
  



  const [contentTypes, setContentTypes] = useState([]);
  const [newContentType, setNewContentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const editorRef = useRef(null);
  const isMounted = useRef(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const imageCallbackRef = useRef(null);






  // const handleHeaderImageSelect = (image) => {
  //   setFormData(prev => ({ ...prev, headerImage: image.url }));
  //   setIsGalleryOpen(false);
  // };

 

 useEffect(() => {
    isMounted.current = true;
    fetchContentTypes();

    return () => {
      isMounted.current = false;
    };
  }, [])





  useEffect(() => {
    if (formData.seoTitle) {
      const slug = formData.seoTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.seoTitle]);






  const handleGallerySelect = (image) => {
    if (imageCallbackRef.current) {
      imageCallbackRef.current(image.url, { 
        alt: image.name,
        width: image.width || '800',
        height: image.height || '600'
      });
      imageCallbackRef.current = null;
    }
    setIsGalleryOpen(false);
  };








  const fetchContentTypes = async () => {
    try {
      const response = await fetch('/api/userapi/content-types');
      if (!response.ok) throw new Error('Failed to fetch content types');
      const data = await response.json();
      if (isMounted.current) {
        setContentTypes(data);
      }
    } catch (error) {
      toast.error('Failed to load content types');
      console.error('Error fetching content types:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && isMounted.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMounted.current) {
          setFormData(prev => ({ ...prev, headerImage: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };






  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const addTag = (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newTags = trimmedInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !formData.tags.includes(tag));

    if (newTags.length > 0) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...newTags]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePasteTag = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    addTag(pastedText);
  };














  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const toastId = toast.loading('Saving article...');
    
    if (!formData.title.trim()) {
      toast.error('Title is required', { id: toastId });
      setLoading(false);
      return;
    }
    
    if (!formData.slug.trim()) {
      toast.error('Slug is required', { id: toastId });
      setLoading(false);
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Content is required', { id: toastId });
      setLoading(false);
      return;
    }
    
    if (!formData.contentType) {
      toast.error('Content Type is required', { id: toastId });
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/userapi/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to save article');
      
      if (isMounted.current) {
        toast.success('Article saved successfully!', { id: toastId });
        setFormData({
          title: '',
          slug: '',
          content: '',
          contentType: '',
          headerImage: '',
          seoTitle: '',
          metaDescription: '',
          isActive: true,
        });
        if (editorRef.current) {
          editorRef.current.setContent('');
        }
      }
    } catch (err) {
      if (isMounted.current) {
        toast.error(err.message, { id: toastId });
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleAddContentType = async () => {
    if (!newContentType.trim()) {
      toast.error('Please enter a content type');
      return;
    }

    const toastId = toast.loading('Adding content type...');
    
    try {
      const response = await fetch('/api/userapi/content-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: newContentType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add content type');
      }

      const data = await response.json();
      
      if (isMounted.current) {
        toast.success('Content type added successfully!', { id: toastId });
        setContentTypes(prevTypes => [
          ...prevTypes,
          {
            _id: data.contentType._id,
            title: data.contentType.title,
          }
        ]);
        setNewContentType('');
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error('Error adding content type: ' + error.message, { id: toastId });
        console.error('Error adding content type:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

       

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <Editor
        apiKey="qsb8v8p271omerjg4lgmfpvhonri87mz625o55pmjskyq9kq"
        onInit={(evt, editor) => editorRef.current = editor}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'image media | removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          relative_urls: false,
          remove_script_host: false,
          convert_urls: true,
          
          // Custom file picker that integrates with our gallery
          file_picker_callback: function(callback, value, meta) {
            if (meta.filetype === 'image') {
              // Store the callback for the gallery to use later
              imageCallbackRef.current = callback;
              
              // Create custom dialog
              const dialog = document.createElement('div');
              dialog.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:9999;';
              
              const content = document.createElement('div');
              content.style.cssText = 'background:white;padding:20px;border-radius:8px;max-width:400px;text-align:center;';
              content.innerHTML = `
                <h2 style="margin-bottom:20px;font-size:18px;font-weight:bold;">Insert Image</h2>
                <div style="display:flex;flex-direction:column;gap:10px;">
                  <button id="uploadBtn" style="padding:10px;background:#4F46E5;color:white;border-radius:4px;border:none;cursor:pointer;font-size:14px;">
                    Upload New Image
                  </button>
                  <div style="text-align:center;margin:10px 0;color:#666;">or</div>
                  <button id="galleryBtn" style="padding:10px;background:#4F46E5;color:white;border-radius:4px;border:none;cursor:pointer;font-size:14px;">
                    Choose from Gallery
                  </button>
                </div>
              `;
              
              dialog.appendChild(content);
              document.body.appendChild(dialog);

              // Handle upload button click
              document.getElementById('uploadBtn').onclick = function() {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                
                input.onchange = async function() {
                  const file = this.files[0];
                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                    const response = await fetch('/api/userapi/upload-image', {
                      method: 'POST',
                      body: formData
                    });

                    if (!response.ok) throw new Error('Upload failed');
                    
                    const data = await response.json();
                    callback(data.location, { 
                      alt: file.name,
                      title: file.name
                    });
                  } catch (err) {
                    console.error('Upload failed:', err);
                    toast.error('Failed to upload image');
                  }
                  document.body.removeChild(dialog);
                };

                input.click();
              };

              // Handle gallery button click
              document.getElementById('galleryBtn').onclick = function() {
                document.body.removeChild(dialog);
                setIsGalleryOpen(true);
              };

              // Close dialog when clicking outside
              dialog.onclick = function(e) {
                if (e.target === dialog) {
                  document.body.removeChild(dialog);
                  imageCallbackRef.current = null;
                }
              };
            }
          },
          
          // Handle direct uploads (drag & drop or paste)
          images_upload_handler: async function(blobInfo, progress) {
            return new Promise(async (resolve, reject) => {
              try {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                
                const response = await fetch('/api/userapi/upload-image', {
                  method: 'POST',
                  body: formData
                });
                
                if (!response.ok) throw new Error('Upload failed');
                
                const data = await response.json();
                resolve(data.location);
              } catch (err) {
                reject('Image upload failed');
                toast.error('Failed to upload image');
              }
            });
          }
        }}
      />

      <ImageGallery 
        isOpen={isGalleryOpen}
        onClose={() => {
          setIsGalleryOpen(false);
          imageCallbackRef.current = null;
        }}
        onSelect={handleGallerySelect}
      />
   

      <ImageGallery 
        isOpen={isGalleryOpen}
        onClose={() => {
          setIsGalleryOpen(false);
          imageCallbackRef.current = null;
        }}
        onSelect={handleGallerySelect}
      />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Header Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            accept="image/jpeg,image/png,image/gif"
          />
          {formData.headerImage && (
            <img 
              src={formData.headerImage} 
              alt="Header" 
              className="mt-2 h-32 w-auto object-cover"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content Type</label>
          <div className="flex gap-2">
            <select
              required
              value={formData.contentType}
              onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Content Type</option>
              {contentTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.title}
                </option>
              ))}
            </select>
            {/* <div className="flex gap-2">
              <input
                type="text"
                placeholder="New content type"
                value={newContentType}
                onChange={(e) => setNewContentType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddContentType}
                className="mt-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div> */}


            
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SEO Title</label>
          <input
            type="text"
            value={formData.seoTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Slug (Auto-generated)</label>
          <input
            type="text"
            value={formData.slug}
            readOnly
            className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm cursor-not-allowed"
          />
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[2.5rem]">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-indigo-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onPaste={handlePasteTag}
              onBlur={() => addTag(tagInput)}
              placeholder="Add tags (separate by comma or press Enter)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500">
              Press Enter or comma to add tags, or paste multiple tags separated by commas
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            value={formData.metaDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Activate Article
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}