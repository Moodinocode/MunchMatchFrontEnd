import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown,  Filter } from 'lucide-react';
import FilterChips from './FilterChips';
import SelectedPollOptions from './SelectedPollOptions';
import CategoryFilter from './CategoryFilter';
import { getOptions } from '../../../Services/optionService';

const fallBackOptions = [
  { title: "Pizza Hut", category: "Fast Food", priceRange: "Medium", image: "https://tse2.mm.bing.net/th/id/OIP.zFrjMRWBG8jbKwo0XS_pJgHaHk?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { title: "Sushi Samba", category: "Healthy", priceRange: "High", image: "https://pbs.twimg.com/profile_images/517818895097663488/ZEB3GrWM.jpeg" },
  { title: "Burger King", category: "Fast Food", priceRange: "Low", image: "https://purepng.com/public/uploads/large/burger-king-logo-xua.png" },
  { title: "Barbar", category: "Burgers", priceRange: "Medium", image: "https://business.cbxcdn.net/storage/businessunits/9d75de2d-b7f8-47e4-a870-b5d925859eb4/300/barbar-restaurant-logo.png" },
  { title: "Zaatar w Zeit", category: "Healthy", priceRange: "Low", image: "https://th.bing.com/th/id/R.aa8d616cbdcb43eb8d27e776476d498c?rik=c3k9x09udETFJg&riu=http%3a%2f%2fkms.zaatarwzeit.net%2fcontent%2fuploads%2fcorporatepage%2f160614100811753%7eZWZ_Meta.jpg&ehk=n6FUD2aOloMoBqi7%2f%2bPwPaij1HSvoNQYBveNcTTXpLY%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1" },
  { title: "Starbucks", category: "Coffee", priceRange: "Medium", image: "https://tse1.mm.bing.net/th/id/OIP.XB-j7DM9zqKYDSYhfkJlWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { title: "KFC", category: "Fast Food", priceRange: "Low", image: "https://tse1.mm.bing.net/th/id/OIP.XB-j7DM9zqKYDSYhfkJlWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
];

const fallbackImage = "https://tse1.mm.bing.net/th/id/OIP.XB-j7DM9zqKYDSYhfkJlWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3";


const maxSelected= 8


const filterOptions = {
  category: ["Fast Food", "Healthy", "Burgers", "Coffee", "Asian", "Mediterranean"],
  priceRange: ["Low", "Medium", "High"],
  dietary: ["Vegetarian", "Vegan", "Gluten-Free", "Halal"],
  rating: ["4+ Stars", "3+ Stars", "2+ Stars"],
  distance: ["< 1km", "< 5km", "< 10km", "Any distance"]
};

const MultiSelectFilter = ({ setPollDetails}) => {
  const [query, setQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [allOptions,setAllOptions] = useState(fallBackOptions)


  const filteredOptions = allOptions.filter((opt) => {
    const matchesSearch = opt.title.toLowerCase().includes(query.toLowerCase());
    const notAlreadySelected = !selectedOptions.some((sel) => sel.id === opt.id);

    
    const matchesFilters = Object.entries(selectedFilters).every(([filterType, selectedValues]) => {
      if (selectedValues.length === 0) return true;
      return selectedValues.includes(opt[filterType]);
    });

    return matchesSearch && notAlreadySelected && matchesFilters;
  });



  const handleSelect = (option) => {
    if (selectedOptions.length < maxSelected) {
      setSelectedOptions(prev => [...prev, option]);
      setPollDetails(prev => ({
        ...prev,
        optionIds: [...(prev.optionIds || []), option.id],
      }));
    }
  };

  useEffect(() => {
    getOptions().then((response) => {
      console.log(response)
      setAllOptions(response.data)
    }).catch(error => console.log(error))
  },[])

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl p-4 border rounded-xl bg-white shadow-lg ">
      {/* Left: Selectable Options */}
      <div className="w-full md:w-7/12">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Choose Poll Options</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {selectedOptions.length}/{maxSelected} selected
            </span>
            <CategoryFilter selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>
          </div>
        </div>

        {/* Active Filter Chips */}
        <FilterChips selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>
        

        <input
          type="text"
          placeholder="Search restaurants..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 mb-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedOptions.length >= maxSelected 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={option.imageUrls?.[0] || fallbackImage}
                    alt={option.title} 
                    className="w-10 h-10 rounded-lg object-cover"
                    // onError={(e) => {
                    //   e.target.src = fallbackImage;
                    // }}
                  />
                  <div>
                    <span className="font-medium">{option.title}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">{option.category}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">{option.priceRange}</span>
                    </div>
                  </div>
                </div>
                {selectedOptions.length >= maxSelected && (
                  <span className="text-xs text-gray-400">Max reached</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No restaurants found</p>
              {query.length > 1 && (
                <button
                  onClick={() => handleSelect({
                     id: `custom-${Date.now()}`,
                    title: query,
                    description: '',
                    tags: ["Custom"],
                    imageUrls: [fallbackImage],
                    // quickAdd: true,
                  })}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  disabled={selectedOptions.length >= maxSelected}
                >
                  + Add "{query}" as new option
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Selected Options */}
          <SelectedPollOptions setPollDetails={setPollDetails} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions}/>
    </div>
  );
};

export default MultiSelectFilter;