"use client";

import { useState } from "react";

/**
 * A "controlled" input: React state is the single source of truth for its value.
 * @param {{ onSearch: (keyword: string) => void, initialValue?: string }} props
 */
export default function SearchBar({ onSearch, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value); // update what the input shows
    onSearch(e.target.value); // tell the parent so it can filter/search
  };

  return (
    <div className="flex items-center">
      <label htmlFor="job-search" className="sr-only">Search jobs</label>
      <input
        id="job-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search jobs..."
        className="rounded-lg border border-gray-300 p-2"
      />
    </div>
  );
}
