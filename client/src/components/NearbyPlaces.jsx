import React from "react";
import { FaBed, FaUtensils, FaCoffee, FaStar  } from "react-icons/fa"; // Import icons
import "../styles/NearbyPlaces.css";

const NearbyPlaces = ({ places, loading }) => {
    if (loading) {
        return <p>Loading nearby places...</p>;
    }

    if (places.length === 0) {
        return <p>No nearby places found.</p>;
    }

    return (
        <div className="places-container">
            {places.map((place, index) => {
                // Conditionally set the icon based on the place type
                let Icon;
                if (place.type === "restaurant") {
                    Icon = FaUtensils;
                } else if (place.type === "hotel") {
                    Icon = FaBed;
                } else if (place.type === "cafe") {
                    Icon = FaCoffee;
                } else {
                    Icon = FaCoffee; // Default icon if type is unknown
                }

                return (
                    <div key={index} className="place-card">
                        <div className="place-card-header">
                            <Icon size={30} className="place-icon" /> {/* Render the icon */}
                            <h4>{place.name}</h4>
                        </div>
                        <p>{place.type}</p>
                        {/* <p>Latitude: {place.lat}, Longitude: {place.lon}</p> */}
                        <p className="place-rating">
                            {place.rating} ⭐
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default NearbyPlaces;
