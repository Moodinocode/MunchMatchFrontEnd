import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

const CategoryFilter = ({ selectedFilters, setSelectedFilters, allOptions }) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Extract all unique tags from the options
  const getAvailableTags = () => {
    const allTags = new Set();
    allOptions.forEach(option => {
      if (option.tags && Array.isArray(option.tags)) {
        option.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const toggleFilter = (tag) => {
    setSelectedFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const getTotalActiveFilters = () => {
    return selectedFilters.tags?.length || 0;
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

  const availableTags = getAvailableTags();

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
            <h3 className="font-medium">Filter by Tags</h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          {availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                    selectedFilters.tags?.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tags available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;