import { useState,useRef,useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

const filterOptions = {
  category: ["Fast Food", "Healthy", "Burgers", "Coffee", "Asian", "Mediterranean"],
  priceRange: ["Low", "Medium", "High"],
  dietary: ["Vegetarian", "Vegan", "Gluten-Free", "Halal"],
  rating: ["4+ Stars", "3+ Stars", "2+ Stars"],
  distance: ["< 1km", "< 5km", "< 10km", "Any distance"]
};

const CategoryFilter = ({selectedFilters,setSelectedFilters}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);

    const clearAllFilters = () => {
    setSelectedFilters({});
  };

    const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType]?.includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...(prev[filterType] || []), value]
    }));
  };


  const getTotalActiveFilters = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0);
  };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowFilterDropdown(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


  return (
    
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors"
              >
                <Filter size={14} />
                Filters
                {getTotalActiveFilters() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalActiveFilters()}
                  </span>
                )}
                <ChevronDown size={14} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white border rounded-lg shadow-lg z-50 p-4 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Filter Options</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                </div>
    
    {Object.entries(filterOptions).map(([filterType, options]) => (
      <div key={filterType} className="mb-4">
        <h4 className="text-sm font-medium mb-2 capitalize">
          {filterType === 'priceRange' ? 'Price Range' : filterType}
        </h4>
        <div className="flex flex-wrap gap-2">
          {options.map(option => (
            <button
              key={option}
              onClick={() => toggleFilter(filterType, option)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                selectedFilters[filterType]?.includes(option)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
)}
            </div>
        
  )
}

export default CategoryFilter