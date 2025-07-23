import React, { useState } from 'react';
import TrashIcon from './TrashIcon';

const UploadImage = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (images.length + newFiles.length > 3) {
      alert('You can only upload up to 3 images total.');
      return;
    }

    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newPreviews]);
    setCurrentIndex(images.length); // go to the first new image

    e.target.value = ''; // reset input
  };

  const removeImage = () => {
    const updated = images.filter((_, index) => index !== currentIndex);
    setImages(updated);

    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(updated.length - 1, 0));
    }
  };

  const showPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const showNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="flex flex-col items-center w-8/12 space-y-4">
      {/* Upload Area or Preview */}
      {images.length === 0 ? (
        <label
  htmlFor="dropzone-file"
  className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
>
  <div className="flex flex-col items-center space-y-2 text-gray-600">
    <svg
      className="w-10 h-10 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16V4m0 0l-3.5 3.5M7 4l3.5 3.5M17 8v12m0 0l-3.5-3.5M17 20l3.5-3.5"
      />
    </svg>
    <p className="font-semibold text-sm">Click to upload</p>
    <p className="text-xs text-gray-400 text-center">
      or drag and drop<br />Up to 3 files (SVG, PNG, JPG, GIF)
    </p>
  </div>
  <input
    id="dropzone-file"
    type="file"
    className="hidden"
    multiple
    accept="image/*"
    onChange={handleFileChange}
  />
</label>

      ) : (
        <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
  {images.length < 3 ? (
    <>
      <label htmlFor="image-uploader" className="w-full h-full cursor-pointer">
        <img
          src={images[currentIndex].url}
          alt={`preview-${currentIndex}`}
          className="object-cover w-full h-full"
          title="Click to upload more"
        />
      </label>
      <input
        id="image-uploader"
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  ) : (
    <div className="w-full h-full relative">
      <img
        src={images[currentIndex].url}
        alt={`preview-${currentIndex}`}
        className="object-cover w-full h-full cursor-not-allowed"
        title="You can't upload more than 3 images"
      />
      {/* Optional: visible tooltip on hover */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        Max 3 images allowed
      </div>
    </div>
  )}

  {/* Remove Button */}
<button
  onClick={removeImage}
  className="btn btn-sm btn-circle absolute right-2 top-2 p-1 group"
>
  <TrashIcon className="group" />
</button>


  {/* Prev Button */}
  {currentIndex > 0 && (
    <button
      onClick={showPrev}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-2 py-1 rounded shadow hover:bg-gray-100"
    >
      ‹
    </button>
  )}

  {/* Next Button */}
  {currentIndex < images.length - 1 && (
    <button
      onClick={showNext}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-2 py-1 rounded shadow hover:bg-gray-100"
    >
      ›
    </button>
  )}
</div>

      )}


    </div>
  );
};

export default UploadImage;
