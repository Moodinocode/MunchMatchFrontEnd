import React from 'react'
import { X } from 'lucide-react';

const FilterChips = ({selectedFilters,setSelectedFilters}) => {

    const getActiveFilterChips = () => {
        const chips = [];
        Object.entries(selectedFilters).forEach(([type, values]) => {
            values.forEach(value => {
            chips.push({ type, value });
            });
        });
        return chips;
    };

    const removeFilterChip = (chipType, chipValue) => {
        setSelectedFilters(prev => ({
            ...prev,
            [chipType]: prev[chipType].filter(v => v !== chipValue)
        }));
    };

    return (
        <>
            {getActiveFilterChips().length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {getActiveFilterChips().map((chip, index) => (
                        <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                            <span>{chip.value}</span>
                            <button
                                onClick={() => removeFilterChip(chip.type, chip.value)}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default FilterChips