'use client';

import { useState } from 'react';

export function SearchBar({ onSearch }) {
    const [searchInput, setSearchInput] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        onSearch(value); // Trigger search immediately when input change
    };

    return (
        <div className="flex items-center">
            <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Search jobs..."
                className="p-2 border border-gray-300 rounded-lg m-auto mt-5"
            />
        </div>
    );
} 