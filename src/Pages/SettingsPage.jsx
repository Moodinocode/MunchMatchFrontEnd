import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../Context/AuthContext'; // Adjust import path as needed
import { updateUser } from '../Services/userService'; // Adjust import path as needed
import { User, Mail, Camera, Save, X } from 'lucide-react';
import Navbar from '../Components/Navbar';

const SettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    profileImageUrl: user?.profileImageUrl || ''
  });
  const [imagePreview, setImagePreview] = useState(user?.profileImageUrl || '');
  const [profileImageBase64, setProfileImageBase64] = useState(''); // Store base64 for upload
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file.' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be smaller than 5MB.' });
        return;
      }

      // Create preview and base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        setProfileImageBase64(base64String);
        setFormData(prev => ({
          ...prev,
          profileImageUrl: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setProfileImageBase64('');
    setFormData(prev => ({
      ...prev,
      profileImageUrl: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Send only the base64 image - backend will identify user via token
      const requestBody = {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImageUrl: profileImageBase64 // Send base64 string directly
      };

      const response = await updateUser(requestBody);
      
      // Assuming the API returns the updated user data with the new image URL
      const updatedUser = response.data;
      
      // Update the auth context with the new user data
      setUser(updatedUser);
      
      // Update session storage
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Reset the base64 since image is now saved
      setProfileImageBase64('');
      
      setMessage({ type: 'success', text: 'Profile image updated successfully!' });
    } catch (error) {
      console.error('Error updating profile image:', error);
      setMessage({ type: 'error', text: 'Failed to update profile image. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
<div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your profile information and preferences.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Change Photo</span>
              </button>
            </div>

            {/* Username Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">{user?.username || 'Not set'}</p>
                  <p className="text-xs text-gray-500">Your unique username</p>
                </div>
              </div>
            </div>

            {/* Email Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">{user?.email || 'Not set'}</p>
                  <p className="text-xs text-gray-500">Your account email address</p>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !profileImageBase64}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Updating...' : 'Update Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SettingsPage;