import React, { useEffect, useState } from "react";
import "../styles/PopularDestinations.css";
import axios from "axios";
import { Link } from "react-router-dom";

const PopularDestinations = ({ userId }) => {
  //console.log("Logged-in User ID:", userId);
  const [fetchedDestinations, setfetchedDestinations] = useState([]);
  
  useEffect(() => {
    // Fetch trips from the backend
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/trips`)
      .then((response) => {
        // console.log("Fetched Trips:", response.data.trips);
        setfetchedDestinations(response.data.trips); // Assuming backend sends a `trips` array
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });
  }, []);

  
  const displayedDestinations = fetchedDestinations.length>0 ? fetchedDestinations: [];

  
  return (
    <section className="popular-destinations">
      <h2>Explore our Latest Itineraries</h2>
      <div className="destination-cards">
        {displayedDestinations.map((dest) => (         
          <Link to={`/trip/${dest._id}`} className="destination-card"  key={dest._id}>
            <img src={`${process.env.REACT_APP_API_BASE_URL}${dest.images[0]?.url}`} alt={dest.name} />
            <h3>{dest.name}</h3>
            {/* <p>{dest.description}</p> */}
            <p>{dest.locations.join(", ")}</p>
            <p>{dest.category}</p>
            <p>{dest.duration} days</p>
            <p>Rating: {dest.rating} ⭐</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;
