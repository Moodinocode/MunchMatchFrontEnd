import React, { useState } from 'react'
import UploadImage from './UploadImage'
import { createOption } from '../../Services/optionService'

const AddRestaurantForm = () => {
  const [option, setOption] = useState({
    title: '',
    description: '',
    //imageUrls: ["https://business.cbxcdn.net/storage/businessunits/9d75de2d-b7f8-47e4-a870-b5d925859eb4/300/barbar-restaurant-logo.png"],
    tags: [],
    images: [] // Store base64 images for upload
  })
  
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Predefined tag options
  const predefinedTags = [
    'Burgers', 'Pizza', 'Sushi', 'Italian', 'Mexican', 'Chinese', 
    'Lebanese', 'Fast Food', 'Fine Dining', 'Cafe', 'Desserts',
    'Vegetarian', 'Vegan', 'Halal', 'Seafood', 'BBQ', 'Steakhouse',
    'Cheap', 'Medium', 'Expensive', 'Delivery', 'Takeout', 'Dine-in'
  ];

  // Handle images from UploadImage component
  const handleImagesChange = (base64Images) => {
    setOption(prevOption => ({
      ...prevOption,
      images: base64Images
    }));
  };

  // Add predefined tag
  const addPredefinedTag = (tag) => {
    if (!option.tags.includes(tag)) {
      setOption(prevOption => ({
        ...prevOption,
        tags: [...prevOption.tags, tag]
      }));
    }
  };

  // Add custom tag
  const addCustomTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !option.tags.includes(trimmedTag)) {
      setOption(prevOption => ({
        ...prevOption,
        tags: [...prevOption.tags, trimmedTag]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setOption(prevOption => ({
      ...prevOption,
      tags: prevOption.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle Enter key for custom tag input
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create the payload using your existing option structure
      // but include the base64 images for backend processing
      const payload = {
        title: option.title,
        description: option.description,
       // imageUrls: option.imageUrls, // Keep existing imageUrls if needed
        tags: option.tags,
        images: option.images // Add base64 images for S3 upload
      };

      console.log('Sending payload to createOption:', payload);
      
      const response = await createOption(payload);
      console.log('createOption response:', response);
      
      // Reset form after successful submission
      setOption({
        title: '',
        description: '',
       // imageUrls: ["https://business.cbxcdn.net/storage/businessunits/9d75de2d-b7f8-47e4-a870-b5d925859eb4/300/barbar-restaurant-logo.png"],
        tags: [],
        images: []
      });

      location.reload();


      
     
      
    } catch (error) {
      console.error('Error in createOption:', error);
      alert(`Error adding restaurant: ${error.message}`);
    } finally {
      setIsLoading(false);
    }


  };

  return (
    <div className='block w-11/12'>
      <h2 className="text-2xl font-semibold mb-6">Add New Restaurant</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Restaurant Name" 
          value={option.title} 
          onChange={(e) => setOption({...option, title: e.target.value})} 
          className="input input-bordered w-full mb-4"
          required
        />
        
        <textarea 
          className="textarea w-full mb-4" 
          value={option.description} 
          onChange={(e) => setOption({...option, description: e.target.value})} 
          placeholder="Description"
          required
        />

        {/* Tags Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tags</label>
          
          {/* Selected Tags Display */}
          {option.tags.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Selected Tags:</p>
              <div className="flex flex-wrap gap-2">
                {option.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="badge badge-primary gap-2 cursor-pointer hover:badge-error"
                    onClick={() => removeTag(tag)}
                    title="Click to remove"
                  >
                    {tag}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tag Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add custom tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="input input-bordered input-sm flex-1"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="btn btn-sm btn-outline"
              disabled={!newTag.trim()}
            >
              Add
            </button>
          </div>

          {/* Predefined Tags */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick Tags:</p>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {predefinedTags
                .filter(tag => !option.tags.includes(tag))
                .map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addPredefinedTag(tag)}
                    className="btn btn-xs btn-ghost hover:btn-primary"
                  >
                    {tag}
                  </button>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className='flex items-start gap-3'>
          <UploadImage 
            onImagesChange={handleImagesChange}
            maxImages={3}
          />
          
          <div className='w-4/12 ml-2'>
            {/* Show selected images count */}
            {option.images.length > 0 && (
              <div className="mb-4 p-2 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">
                  {option.images.length} image{option.images.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* Show selected tags count */}
            {option.tags.length > 0 && (
              <div className="mb-4 p-2 bg-blue-50 rounded">
                <p className="text-sm text-blue-600">
                  {option.tags.length} tag{option.tags.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            <button 
              type="submit"
              className={`btn w-full mt-6 shadow-md hover:scale-105 transition-transform duration-200 ${
                isLoading ? 'btn-disabled loading' : 'btn-success'
              }`}
              disabled={!option.title || !option.description || isLoading}
            >
              {isLoading ? 'Adding Restaurant...' : 'Add Restaurant'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddRestaurantForm