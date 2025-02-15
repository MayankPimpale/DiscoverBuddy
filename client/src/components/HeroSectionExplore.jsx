import React, { useEffect, useState } from "react";
import "../styles/HeroExplore.css";
import axios from "axios";

const HeroSectionExplore = ({cards}) => {
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrips, setFilteredTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`https://discoverbuddy.onrender.com/api/trips`);
        console.log("Fetched trips:", response.data); // Debug API response
  
        if (Array.isArray(response.data)) {
          setTrips(response.data);
          setFilteredTrips(response.data); // Ensure it's always an array
        } else {
          console.error("Unexpected API response:", response.data);
          setTrips([]); // Fallback to an empty array
          setFilteredTrips([]);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTrips([]); // Handle error gracefully
        setFilteredTrips([]);
      }
    };
  
    fetchTrips();
  }, []);
  

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTrips(trips); // Show all trips when no search query
    } else {
      const filtered = trips.filter((trip) =>
        trip.title?.toLowerCase().includes(searchQuery.toLowerCase()) // 🔹 Safe check with ?. 
      );
      setFilteredTrips(filtered);
    }
  }, [searchQuery, trips]);

  return (
    <div className="hero-section">
      <h1>Discover Your New Adventure</h1>
      <p>Explore the world with our personalized travel recommendations.</p>
      <div className="trips-container">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div key={trip.id} className="trip-card">
              <h3>{trip.title}</h3>
              <p>{trip.description}</p>
            </div>
          ))
        ) : (
          searchQuery && <p>No trips found.</p>
        )}
      </div>
    </div>
  );
};

export default HeroSectionExplore;
