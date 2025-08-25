import React from 'react'

const ViewRestaurantDetails = ({title, description, imageUrls, tags, setIsDetailsModalOpen}) => {
  return (
    <dialog id="my_modal_2" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl p-0 rounded-2xl shadow-xl overflow-hidden">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 bg-white/80 hover:bg-white text-gray-700 shadow-md" 
          onClick={() => setIsDetailsModalOpen(false)}
        >
          ✕
        </button>
        
        {/* Hero Image Section */}
        {imageUrls && imageUrls.length > 0 && (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img 
              src={imageUrls[0]} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Title overlay on image */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {title}
              </h1>
            </div>
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-6 md:p-8">
          {/* Title (if no image) */}
          {(!imageUrls || imageUrls.length === 0) && (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {title}
            </h1>
          )}
          
          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Description Section */}
          {description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">About This Restaurant</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {description}
              </p>
            </div>
          )}

          
          {/* Additional Info Section */}
          {/* <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Location details available</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Hours & contact info</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="modal-backdrop" onClick={() => setIsDetailsModalOpen(false)}>
      </div>
    </dialog>
  )
}

export default ViewRestaurantDetails