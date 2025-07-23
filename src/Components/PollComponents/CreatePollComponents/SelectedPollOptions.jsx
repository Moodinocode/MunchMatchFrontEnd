import { X } from 'lucide-react';


const fallbackImage = "https://tse1.mm.bing.net/th/id/OIP.XB-j7DM9zqKYDSYhfkJlWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3";

const SelectedPollOptions = ({selectedOptions, setSelectedOptions, setPollDetails}) => {
    const maxSelections = 4 //can be passed down 
  return (
    <div className="w-full md:w-5/12 border-l-0 md:border-l md:pl-4">
        <h2 className="text-lg font-semibold mb-3">Selected Options</h2>
        
        {selectedOptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Select up to {maxSelections} restaurants</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedOptions.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <img 
                    src={option.imageUrls?.[0] || fallbackImage}
                    alt={option.title} 
                    className="w-8 h-8 rounded object-cover"
                    // onError={(e) => {
                    //   e.target.src = fallbackImage;
                    // }}
                  />
                  <div>
                    <span className="font-medium">{option.title}</span>
                    {option.quickAdd && (
                      <span className="text-xs text-blue-600 ml-2">(Custom)</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {setSelectedOptions(prev => prev.filter(o => o.id !== option.id));
                    setPollDetails(prev => ({
                      ...prev,
                      optionIds: prev.optionIds.filter(id => id !== option.id)
                    }));
                  }}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
  )
}

export default SelectedPollOptions