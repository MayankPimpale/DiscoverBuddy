import React, { useState, useEffect } from "react";
import HeroSectionExplore from "../components/HeroSectionExplore.jsx";
import PopularDestinations from "../components/PopularDestinations.jsx";
// import PersonalizedRecommendations from "../components/PersonalizedRecommendations.jsx";
// import Filters from "../components/Filters.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import axios from "axios";
import "../styles/ExplorePage.css";

const ExplorePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    // console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/trips`);
        setTrips(response.data.trips); // Assuming the response structure is { trips: [...] }
      } catch (err) {
        setError("Failed to load trips. Please try again later.");
      }
    };

    fetchTrips();
  }, []);


  const handleFilterChange = (filters) => {
    let updatedDestinations = [...destinations];

    setFilteredDestinations(updatedDestinations);
  };

  return (
    <div className="explore-page">
      <Header/>
      <HeroSectionExplore />
      {/* <Filters onFilterChange={handleFilterChange} /> */}
      {/* <PersonalizedRecommendations /> */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <PopularDestinations destinations={userTrips} userId={loggedInUserId} />
      <Footer/>
    </div>
  );
};

export default ExplorePage;
