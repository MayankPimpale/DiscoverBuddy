import React, { useState } from "react";
import "../styles/Filters.css";

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: "All",
    location: "",
    rating: 0,
    duration: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="filters">
      <select name="category" onChange={handleInputChange}>
        <option value="All">All Categories</option>
        <option value="Adventure">Adventure</option>
        <option value="Family">Family</option>
        <option value="Solo Travel">Solo Travel</option>
      </select>
      <input
        type="text"
        name="location"
        placeholder="Enter location"
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="rating"
        placeholder="Minimum Rating"
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="duration"
        placeholder="Max Duration (days)"
        onChange={handleInputChange}
      />
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default Filters;
