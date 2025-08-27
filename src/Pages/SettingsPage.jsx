import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { updateUser } from '../Services/userService'; 
import { User, Mail, Camera, Save, X } from 'lucide-react';
import Navbar from '../Components/Navbar';

const SettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(user?.profileImageUrl || '');
  const [imageBase64, setImageBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const showMessage = (type, text) => setMessage({ type, text });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImagePreview(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview('');
    setImageBase64('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!imageBase64) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await updateUser({
        id: user.id,
        username: user.username,
        email: user.email,
        profileImageUrl: imageBase64
      });

      const updatedUser = response.data;
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setImageBase64('');
      showMessage('success', 'Profile image updated successfully!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      showMessage('error', 'Failed to update profile image. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  const InfoField = ({ icon: Icon, label, value, description }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <Icon className="h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm font-medium text-gray-900">{value || 'Not set'}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

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
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
              </div>

              <InfoField 
                icon={User} 
                label="Username" 
                value={user.username} 
                description="Your unique username" 
              />

              <InfoField 
                icon={Mail} 
                label="Email Address" 
                value={user.email} 
                description="Your account email address" 
              />

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
                  onClick={handleSubmit}
                  disabled={isLoading || !imageBase64}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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