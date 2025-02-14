import React, { useState,useEffect } from "react";
import { toast } from "react-hot-toast";

const  Mobiles = ({ mobileId, onClose }) => {


  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    headerImage: "",
    seoTitle: "",
    metaDescription: "",
    releaseDate: "",
    isActive: true,
    slug:"",
    tags: [],
    ramStorage: [{ ram: "", storage: "" }], // New field for RAM and Storage combinations
    sections: {
      Build: [{ title: "", description: "", link: "" }],
      Frequency: [{ title: "", description: "", link: "" }],
      Processor: [{ title: "", description: "", link: "" }],
      Display: [{ title: "", description: "", link: "" }],
      Memory: [{ title: "", description: "", link: "" }],
      Camera: [{ title: "", description: "", link: "" }],
      Connectivity: [{ title: "", description: "", link: "" }],
      Features: [{ title: "", description: "", link: "" }],
      Battery: [{ title: "", description: "", link: "" }],
    },
    Price: [{ price: "", description: "", link: "" }],
    createdBy: "",
    views: { default: 0 },
    favorites: { default: 0 },

  });

  const [releaseDateType, setReleaseDateType] = useState('date'); 
  const [brands, setBrands] = useState([]);
  const [tag, setTag] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [showSectionNameInput, setShowSectionNameInput] = useState(false);


  



  useEffect(() => {
    fetchBrands();
  }, []);
  
  // For mobile data fetching (only when editing)
  useEffect(() => {
    if (mobileId) {
      fetchMobileData();
    }
  }, [mobileId]);



  const fetchMobileData = async () => {
    try {
      const response = await fetch(`/api/userapi/mobiles/${mobileId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch mobile data');
      
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      toast.error('Error fetching mobile data');
      console.error('Error:', error);
    }
  };


  const addRamStorage = () => {
    setFormData({
      ...formData,
      ramStorage: [...formData.ramStorage, { ram: "", storage: "" }]
    });
  };

  // Remove RAM/Storage combination
  const removeRamStorage = (index) => {
    if (formData.ramStorage.length > 1) {
      const newRamStorage = [...formData.ramStorage];
      newRamStorage.splice(index, 1);
      setFormData({
        ...formData,
        ramStorage: newRamStorage
      });
    } else {
      toast.error("Cannot remove the last RAM/Storage entry");
    }
  };

  // Handle RAM/Storage change
  const handleRamStorageChange = (index, field, value) => {
    const newRamStorage = [...formData.ramStorage];
    newRamStorage[index][field] = value;
    setFormData({
      ...formData,
      ramStorage: newRamStorage
    });
  };



  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/userapi/mobiles/getmobilebrands');
      
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        
        // Since data is directly an array of brand objects
        const brandNames = data.map(brand => brand.name);
        console.log("Processed brand names:", brandNames);
        
        setBrands(brandNames);
      } else {
        console.error("Failed to fetch brands, Status:", response.status);
        setBrands([]);
        toast.error("Failed to load brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
      toast.error("Error loading brands");
    }
  };






  
  const validateForm = () => {
    // Basic fields validation
    if (!formData.brand?.trim()) {
      toast.error("Please select a brand");
      return false;
    }
    if (!formData.model?.trim()) {
      toast.error("Please enter a model");
      return false;
    }
    if (!formData.headerImage) {
      toast.error("Please upload an image");
      return false;
    }
    if (!formData.seoTitle?.trim()) {
      toast.error("Please enter SEO title");
      return false;
    }
    if (!formData.metaDescription?.trim()) {
      toast.error("Please enter meta description");
      return false;
    }
  
    // Validate RAM/Storage
    for (const rs of formData.ramStorage) {
      if (!rs.ram?.trim() || !rs.storage?.trim()) {
        toast.error("Please fill all RAM and Storage fields");
        return false;
      }
    }
  
    // Validate Price
    for (const price of formData.Price) {
      if (!price.price || !price.description?.trim()) {
        toast.error("Please fill price and description for all price entries");
        return false;
      }
    }
  
    // Validate Sections
    for (const [sectionName, specifications] of Object.entries(formData.sections)) {
      for (const spec of specifications) {
        if (!spec.title?.trim() || !spec.description?.trim()) {
          toast.error(`Please fill all fields in ${sectionName} section`);
          return false;
        }
        // Note: link can be empty
      }
    }
  
    return true;
  };

  const handleAddTag = () => {
    if (!tag.trim()) return;
  
    const newTags = tag.split(',').map(t => t.trim()).filter(t => t !== '');
    
    setFormData(prevState => {
      const updatedTags = [...prevState.tags];
      
      newTags.forEach(newTag => {
        if (newTag && !updatedTags.includes(newTag)) {
          updatedTags.push(newTag);
        } else if (newTag) {
          toast.error(`Tag "${newTag}" already exists`);
        }
      });
  
      return {
        ...prevState,
        tags: updatedTags
      };
    });
    
    setTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          headerImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e, section, index, field) => {
    // Ensure event target is defined before extracting values
    if (!e.target) return;
  
    const { name, value } = e.target;
  
    // Handle Price section changes
    if (section === "Price") {
      const newPrice = [...formData.Price];
      newPrice[index][field] = value;
      setFormData({
        ...formData,
        Price: newPrice,
      });
      return;
    }
  
    // Handle other sections (specifications)
    if (section) {
      const newSections = { ...formData.sections };
      newSections[section][index][field] = value;
      setFormData({
        ...formData,
        sections: newSections,
      });
      return;
    }
  
    // Handle brand and model changes with slug generation
    if (name === "brand" || name === "model") {
      setFormData(prevState => {
        const newBrand = name === "brand" ? value : prevState.brand;
        const newModel = name === "model" ? value : prevState.model;
        
        // Only generate slug if both brand and model exist
        const newSlug = newBrand && newModel 
          ? `${newBrand}-${newModel}`
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphen
              .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
              .replace(/^-+|-+$/g, '')     // Remove leading/trailing hyphens
          : prevState.slug;
  
        return {
          ...prevState,
          [name]: value,
          slug: newSlug
        };
      });
      return;
    }
  
    // Handle release date validation
    if (name === "releaseDate") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value) || value === "" || value === "Coming Soon") {
        setFormData(prevState => ({
          ...prevState,
          releaseDate: value
        }));
      }
      return;
    }
  
    // Handle all other field changes
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const addPrice = () => {
    setFormData({
      ...formData,
      Price: [...formData.Price, { price: "", description: "", link: "" }],
    });
  };

  const removePrice = (index) => {
    if (formData.Price.length > 1) {
      const newPrice = [...formData.Price];
      newPrice.splice(index, 1);
      setFormData({
        ...formData,
        Price: newPrice,
      });
    } else {
      toast.error("Cannot remove the last price entry");
    }
  };

  const addSpecification = (section) => {
    if (section === "Price") {
      addPrice();
      return;
    }
    const newSections = { ...formData.sections };
    newSections[section].push({ title: "", description: "", link: "" });
    setFormData({
      ...formData,
      sections: newSections,
    });
  };

  const removeSpecification = (section, index) => {
    if (section === "Price") {
      removePrice(index);
      return;
    }
    if (formData.sections[section].length > 1) {
      const newSections = { ...formData.sections };
      newSections[section].splice(index, 1);
      setFormData({
        ...formData,
        sections: newSections,
      });
    } else {
      toast.error("Cannot remove the last specification");
    }
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toast.error("Please enter a section name");
      return;
    }
    if (formData.sections[newSectionName]) {
      toast.error("Section already exists");
      return;
    }
    setFormData({
      ...formData,
      sections: {
        ...formData.sections,
        [newSectionName]: [{ title: "", description: "", link: "" }],
      },
    });
    setNewSectionName("");
    setShowSectionNameInput(false);
  };

  const removeSection = (sectionName) => {
    const newSections = { ...formData.sections };
    delete newSections[sectionName];
    setFormData({
      ...formData,
      sections: newSections,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    const loadingToast = toast.loading(
      mobileId ? 'Updating mobile details...' : 'Creating new mobile...',
      { duration: Infinity }
    );
  
    try {
      const response = await fetch(
        mobileId ? `/api/userapi/mobiles/${mobileId}` : '/api/userapi/mobiles/savemobile',
        {
          method: mobileId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        }
      );
  
      const data = await response.json();
      toast.dismiss(loadingToast);
  
      if (data.status === 'success') {
        // Show success toast and wait before closing
        await new Promise((resolve) => {
          toast.success(
            mobileId ? 'Mobile updated successfully!' : 'New mobile created successfully!',
            {
              duration: 3000,
              onClose: resolve
            }
          );
          // Delay closing the modal
          setTimeout(() => {
            if (onClose) onClose();
          }, 1000);
        });
      } else {
        toast.error(data.message || 'Failed to save mobile details', {
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.dismiss(loadingToast);
      toast.error('Something went wrong while saving', {
        duration: 3000
      });
    }
  };



  const RamStorageSection = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">RAM and Storage</h2>
        <button
          type="button"
          onClick={addRamStorage}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Add RAM/Storage
        </button>
      </div>

      <div className="space-y-3">
        {formData.ramStorage.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Configuration {index + 1}</span>
              <button
                type="button"
                onClick={() => removeRamStorage(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="RAM (e.g., 4GB)"
                value={item.ram}
                onChange={(e) => handleRamStorageChange(index, "ram", e.target.value)}
                className="w-full p-1.5 text-sm border rounded"
              />
              <input
                type="text"
                placeholder="Storage (e.g., 64GB)"
                value={item.storage}
                onChange={(e) => handleRamStorageChange(index, "storage", e.target.value)}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return ( 
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-3">Mobiles info</h2>

          <div className="space-y-3">
            <div>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full text-sm border rounded p-1.5"
              />
              {formData.headerImage && (
                <img
                  src={formData.headerImage}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded mt-2"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
  <select   
    name="brand"   
    value={formData.brand}   
    onChange={handleChange}   
    className="w-full p-1.5 text-sm border rounded" 
  >   
    {/* Only show "Select Brand" if no brand is selected */}
    {!formData.brand && <option value="">Select Brand</option>}   
    {brands && brands.length > 0 ? (     
      brands.map((brand) => (       
        <option key={brand} value={brand}>         
          {brand}       
        </option>     
      ))   
    ) : (     
      <option value="" disabled>Loading brands...</option>   
    )} 
  </select>               
  <input                 
    type="text"                 
    name="model"                 
    placeholder="Model"                 
    value={formData.model}                 
    onChange={handleChange}                 
    className="w-full p-1.5 text-sm border rounded"               
  />             
</div>


<input
  type="text"
  name="slug"
  placeholder="Slug"
  value={formData.slug}
  disabled
  className="w-full p-1.5 text-sm border rounded bg-gray-100 mt-3"
/>






<div className="flex flex-col gap-2">
  <label className="text-sm text-gray-600">Release Date</label>
  <div className="flex gap-4 mb-2">
    <label className="flex items-center">
      <input
        type="radio"
        name="releaseDateType"
        value="date"
        checked={releaseDateType === 'date'}
        onChange={(e) => {
          setReleaseDateType('date');
          setFormData(prev => ({...prev, releaseDate: ''}));
        }}
        className="mr-2"
      />
      <span className="text-sm">Select Date</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="releaseDateType"
        value="coming-soon"
        checked={releaseDateType === 'coming-soon'}
        onChange={(e) => {
          setReleaseDateType('coming-soon');
          setFormData(prev => ({...prev, releaseDate: 'Coming Soon'}));
        }}
        className="mr-2"
      />
      <span className="text-sm">Coming Soon</span>
    </label>
  </div>
  {releaseDateType === 'date' ? (
    <input
      type="date"
      name="releaseDate"
      value={formData.releaseDate}
      onChange={handleChange}
      className="w-full p-1.5 text-sm border rounded"
      title="Release Date"
    />
  ) : (
    <input
      type="text"
      value="Coming Soon"
      disabled
      className="w-full p-1.5 text-sm border rounded bg-gray-50"
    />
  )}
</div>










            <input
              type="text"
              name="seoTitle"
              placeholder="SEO Title"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full p-1.5 text-sm border rounded"
            />
            <textarea
              name="metaDescription"
              placeholder="Meta Description"
              value={formData.metaDescription}
              onChange={handleChange}
              className="w-full p-1.5 text-sm border rounded"
              rows="2"
            />

            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  className="flex-1 p-1.5 text-sm border rounded"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((t, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-0.5 text-sm rounded-full flex items-center"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="ml-1 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <RamStorageSection />
        {/* Price Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Price</h2>
            <button
              type="button"
              onClick={() => addPrice()}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Add Price
            </button>
          </div>

          <div className="space-y-3">
            {formData.Price.map((price, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Price Entry {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removePrice(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Price"
                    value={price.price}
                    onChange={(e) => handleChange(e, "Price", index, "price")}
                    className="w-full p-1.5 text-sm border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={price.description}
                    onChange={(e) =>
                      handleChange(e, "Price", index, "description")
                    }
                    className="w-full p-1.5 text-sm border rounded"
                  />
                  <input
                    type="url"
                    placeholder="Link"
                    value={price.link}
                    onChange={(e) => handleChange(e, "Price", index, "link")}
                    className="w-full p-1.5 text-sm border rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
  <h2 className="text-lg font-medium mb-4">Specifications</h2>

  <div className="space-y-4">
    {Object.entries(formData.sections).map(([section, specifications]) => (
      <div key={section} className="p-3 border rounded">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm">{section}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addSpecification(section)}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Add Spec
            </button>
            <button
              type="button"
              onClick={() => removeSection(section)}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {specifications.map((spec, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs">
                  Specification {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSpecification(section, index)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={spec.title}
                  onChange={(e) =>
                    handleChange(e, section, index, "title")
                  }
                  className="w-full p-1.5 text-sm border rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={spec.description}
                  onChange={(e) =>
                    handleChange(e, section, index, "description")
                  }
                  className="w-full p-1.5 text-sm border rounded"
                />
                <input
                  type="url"
                  placeholder="Link"
                  value={spec.link}
                  onChange={(e) =>
                    handleChange(e, section, index, "link")
                  }
                  className="w-full p-1.5 text-sm border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* Add Section Input - Moved to bottom */}
  {showSectionNameInput ? (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        value={newSectionName}
        onChange={(e) => setNewSectionName(e.target.value)}
        placeholder="Enter section name"
        className="flex-1 p-1.5 text-sm border rounded"
      />
      <button
        type="button"
        onClick={handleAddSection}
        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => {
          setShowSectionNameInput(false);
          setNewSectionName("");
        }}
        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setShowSectionNameInput(true)}
      className="mt-4 w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center justify-center gap-2"
    >
      <span>Add New Section</span>
    </button>
  )}
</div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Save Mobile Details
        </button>
      </form>
    </div>
  );
};

export default Mobiles;
